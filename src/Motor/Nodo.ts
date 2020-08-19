import * as Discord from '../DiscordAPI/index';
import { Mundo } from './Mundo';
import { Usuario } from './Usuario';

export class Nodo {
	private readonly nombre: string;
	private readonly mundo: Mundo;
	private canalVoz: Discord.CanalDeVoz;
	private canalTexto: Discord.CanalDeTexto;
	private readonly adyacentes: Array<Nodo> = new Array<Nodo>();

	public constructor(nombre: string, mundo: Mundo) {
		this.nombre = nombre;
		this.mundo = mundo;
	}

	public async Generar(servidor: Discord.Servidor, categoría: Discord.Categoría): Promise<void> {
		await this.CrearCanales(servidor, categoría);
	}

	private async CrearCanales(servidor: Discord.Servidor, categoría: Discord.Categoría): Promise<void> {
		this.canalTexto = await servidor.CrearCanalDeTexto(this.nombre, categoría);
		this.canalVoz = await servidor.CrearCanalDeVoz(this.nombre, categoría);
	}

	public async AgregarAdyacente(adyacente: Nodo): Promise<void> {
		this.adyacentes.push(adyacente);
	}
	public async EstablecerVisible(usuario: Usuario): Promise<void> {
		await this.canalVoz.CambiarPermisos(this.PermisoDeCanalDeVoz(usuario));
	}

	public EsMismoNodo(nodo: Nodo): boolean {
		return this == nodo;
	}

	public EsAdyacenteCon(nodo: Nodo): boolean {
		return this.adyacentes.some((nodoAdyacente) => nodo.EsMismoNodo(nodoAdyacente));
	}

	public TieneCanal(canal: Discord.Canal): boolean {
		return this.canalVoz.EsMismoCanal(canal) || this.canalTexto.EsMismoCanal(canal);
	}

	public ObtenerAdyacentes(): Array<Nodo> {
		return this.adyacentes;
	}

	public ObtenerMundo(): Mundo {
		return this.mundo;
	}

	public ObtenerCanalDeVoz(): Discord.CanalDeVoz {
		return this.canalVoz;
	}

	public async EstablecerInicial(usuario: Usuario): Promise<void> {
		await Promise.all(new Array<Promise<void>>(this.canalVoz.CambiarPermisos(this.PermisoDeCanalDeVoz(usuario)), this.canalTexto.CambiarPermisos(this.PermisoDeCanalDeTexto(usuario))));
	}

	public async LlegarDesde(usuario: Usuario, nodo: Nodo): Promise<void[]> {
		if (nodo == null) {
			const promesas: Promise<void>[] = this.adyacentes.map((nodoAdyacente) => nodoAdyacente.EstablecerVisible(usuario));
			return Promise.all(promesas);
		}

		const promesas: Promise<void>[] = this.adyacentes.filter((nodoAdyacente) => !nodoAdyacente.EsMismoNodo(nodo)).map((nodoAdyacente) => nodoAdyacente.EstablecerVisible(usuario));

		promesas.push(this.canalTexto.CambiarPermisos(this.PermisoDeCanalDeTexto(usuario)));
		return Promise.all(promesas);
	}

	public async SalirHacia(usuario: Usuario, nodo: Nodo): Promise<void[]> {
		if (nodo == null) {
			const promesas: Promise<void>[] = this.adyacentes.map((nodoAdyacente) => nodoAdyacente.RemoverPermisosDeVoz(usuario));
			return Promise.all(promesas);
		}

		const promesas: Promise<void>[] = this.adyacentes.filter((nodoAdyacente) => !nodoAdyacente.EsMismoNodo(nodo)).map((nodoAdyacente) => nodoAdyacente.RemoverPermisosDeVoz(usuario));

		if (!nodo.EsAdyacenteCon(this)) promesas.push(this.canalVoz.RemoverPermisos(usuario.ObtenerCliente()));
		promesas.push(this.canalTexto.RemoverPermisos(usuario.ObtenerCliente()));

		return Promise.all(promesas);
	}

	private async RemoverPermisosDeVoz(usuario: Usuario) {
		return this.canalVoz.RemoverPermisos(usuario.ObtenerCliente());
	}

	private PermisoDeCanalDeVoz(usuario: Usuario): Discord.GrupoDePermisos {
		return usuario.CrearGrupoDePermisos(['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'], ['PRIORITY_SPEAKER', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']);
	}

	private PermisoDeCanalDeTexto(usuario: Usuario): Discord.GrupoDePermisos {
		return usuario.CrearGrupoDePermisos(
			['READ_MESSAGE_HISTORY', 'SEND_MESSAGES'], //"VIEW_CHANNEL"
			['ADD_REACTIONS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']
		);
	}
}
