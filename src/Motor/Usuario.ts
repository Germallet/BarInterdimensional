import * as Discord from '#discord-api';
import { Perfil } from './Perfil';
import { Nodo } from './Nodo';
import { Mutex } from 'async-mutex';

export class Usuario {
	private readonly cliente: Discord.Cliente;
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();
	private readonly mutex: Mutex = new Mutex();

	public constructor(cliente: Discord.Cliente) {
		this.cliente = cliente;
	}

	public AgregarPerfil(perfil: Perfil): void {
		this.perfiles.push(perfil);
	}

	/*private ObtenerPerfil(mundo: Mundo): Perfil {
		return this.perfiles.find((perfil) => perfil.EsDeMundo(mundo));
	}*/

	public ObtenerCliente(): Discord.Cliente {
		return this.cliente;
	}

	public TieneId(id: string): boolean {
		return this.cliente.TieneId(id);
	}

	public EsCliente(cliente: Discord.Cliente): boolean {
		return this.cliente.EsMismosCliente(cliente);
	}

	public async Moverse(origen: Nodo, destino: Nodo): Promise<void> {
		const release = await this.mutex.acquire();

		try {
			if (origen != null && destino != null && !origen.EsAdyacenteCon(destino)) {
				return this.MovimientoForzado(destino, origen);
			} else {
				return this.MovimientoNormal(origen, destino);
			}
		} finally {
			release();
		}
	}

	private async MovimientoNormal(origen: Nodo, destino: Nodo): Promise<void> {
		if (origen != null) await origen.SalirHacia(this, destino);
		if (destino != null) await destino.LlegarDesde(this, origen);
	}

	private async MovimientoForzado(origen: Nodo, destino: Nodo): Promise<void> {
		await Promise.all(new Array<Promise<void>>(this.cliente.CambiarCanalDeVoz(destino.ObtenerCanalDeVoz()), this.MovimientoNormal(origen, destino)));
	}

	public CrearGrupoDePermisos(permitidos: Discord.Permiso[], denegados: Discord.Permiso[]): Discord.GrupoDePermisos {
		return this.cliente.CrearGrupoDePermisos(permitidos, denegados);
	}
}
