import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Usuario } from '#usuario';

export class Nodo {
	private readonly id: number;
	private readonly nombre: string;
	private canalVoz: Discord.CanalDeVoz;
	private canalTexto: Discord.CanalDeTexto;
	private readonly adyacentes: Array<Nodo> = new Array<Nodo>();

	public constructor(id: number, nombre: string) {
		this.id = id;
		this.nombre = nombre;
	}

	public async Generar(nodoPrisma: Prisma.nodo, servidor: Discord.Servidor, categoría: Discord.Categoría): Promise<void> {
		await this.GenerarCanalDeVoz(servidor, nodoPrisma.canalvoz, categoría);
		await this.GenerarCanalDeTexto(servidor, nodoPrisma.canaltexto, categoría);
	}

	private async GenerarCanalDeVoz(servidor: Discord.Servidor, idCanal: string, categoría: Discord.Categoría): Promise<void> {
		try {
			this.canalVoz = servidor.ObtenerCanalDeVoz(idCanal);
		} catch {
			this.canalVoz = await servidor.CrearCanalDeVoz(this.nombre, categoría);
			await Persistencia.BaseDeDatos().GuardarNodo(this.id, { canalvoz: this.canalVoz.ObtenerId() });
		}
	}
	private async GenerarCanalDeTexto(servidor: Discord.Servidor, idCanal: string, categoría: Discord.Categoría): Promise<void> {
		try {
			this.canalTexto = servidor.ObtenerCanalDeTexto(idCanal);
		} catch {
			this.canalTexto = await servidor.CrearCanalDeTexto(this.nombre, categoría);
			await Persistencia.BaseDeDatos().GuardarNodo(this.id, { canaltexto: this.canalTexto.ObtenerId() });
		}
	}

	public async AgregarAdyacente(adyacente: Nodo): Promise<void> {
		this.adyacentes.push(adyacente);
	}

	public async EstablecerVisible(usuario: Usuario): Promise<void> {
		await this.canalVoz.CambiarPermisos(this.PermisoDeCanalDeVoz(usuario));
	}

	public async MostrarAdyacentes(usuario: Usuario): Promise<void> {
		await Promise.all(this.adyacentes.map((nodoAdyacente) => nodoAdyacente.EstablecerVisible(usuario)));
	}

	public EsMismoNodo(nodo: Nodo): boolean {
		return this == nodo;
	}

	public EsAdyacenteCon(nodo: Nodo): boolean {
		return this.adyacentes.some((nodoAdyacente) => nodo.EsMismoNodo(nodoAdyacente));
	}

	public TieneCanalDeVoz(canal: Discord.CanalDeVoz): boolean {
		return this.canalVoz.EsMismoCanal(canal);
	}
	public TieneCanalDeTexto(canal: Discord.CanalDeTexto): boolean {
		return this.canalTexto.EsMismoCanal(canal);
	}

	public ObtenerCanalDeVoz(): Discord.CanalDeVoz {
		return this.canalVoz;
	}

	public async Entrar(usuario: Usuario): Promise<void> {
		await Promise.all(new Array<Promise<void>>(this.canalVoz.CambiarPermisos(this.PermisoDeCanalDeVoz(usuario)), this.canalTexto.CambiarPermisos(this.PermisoDeCanalDeTexto(usuario))));
	}

	public async LlegarDesde(usuario: Usuario, nodo: Nodo): Promise<void> {
		if (nodo == null) {
			return this.MostrarAdyacentes(usuario);
		}
		await Promise.all(
			new Array<Promise<void>>(
				this.Entrar(usuario),
				new Promise((resolve) => setTimeout(resolve, 1500)).then(() => this.MostrarAdyacentes(usuario))
			)
		);
	}

	public async SalirHacia(usuario: Usuario, nodo: Nodo): Promise<void> {
		if (nodo == null) {
			return this.RemoverPermisosDeAdyacentes(usuario);
		}
		await Promise.all(new Array<Promise<void>>(this.RemoverPermisosDeAdyacentes(usuario), this.RemoverPermisos(usuario)));
	}

	private async RemoverPermisos(usuario: Usuario): Promise<void> {
		await Promise.all(new Array<Promise<void>>(this.canalVoz.RemoverPermisos(usuario.ObtenerCliente()), this.canalTexto.RemoverPermisos(usuario.ObtenerCliente())));
	}

	private async RemoverPermisosDeAdyacentes(usuario: Usuario): Promise<void> {
		Promise.all(this.adyacentes.map((nodoAdyacente) => nodoAdyacente.RemoverPermisos(usuario)));
	}

	private PermisoDeCanalDeVoz(usuario: Usuario): Discord.GrupoDePermisos {
		return usuario.CrearGrupoDePermisos(['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'], ['PRIORITY_SPEAKER', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']);
	}

	private PermisoDeCanalDeTexto(usuario: Usuario): Discord.GrupoDePermisos {
		return usuario.CrearGrupoDePermisos(
			['READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL'], //"VIEW_CHANNEL"
			['ADD_REACTIONS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']
		);
	}
}
