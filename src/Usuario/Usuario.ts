import * as Discord from '#discord-api';
import { Mutex } from 'async-mutex';
import { Nodo } from '#universo';
import { Perfil } from './Perfil';

export class Usuario {
	private readonly cliente: Discord.Cliente;
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();
	private readonly mutex: Mutex = new Mutex();
	private corrigeMovimiento: boolean;

	public constructor(cliente: Discord.Cliente) {
		this.cliente = cliente;
		this.corrigeMovimiento = false;
	}

	public AgregarPerfil(perfil: Perfil): void {
		this.perfiles.push(perfil);
	}

	public ObtenerCliente(): Discord.Cliente {
		return this.cliente;
	}

	public CorrigeMovimiento(): boolean {
		return this.corrigeMovimiento;
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
			if (this.CorrigeMovimiento()) return;
			if (origen != null && destino != null && !origen.EsAdyacenteCon(destino)) {
				await this.MovimientoForzado(destino, origen);
			} else {
				await this.MovimientoNormal(origen, destino);
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
		this.corrigeMovimiento = true;
		await Promise.all(new Array<Promise<void>>(this.cliente.CambiarCanalDeVoz(destino.ObtenerCanalDeVoz()), destino.Entrar(this), this.MovimientoNormal(null, destino)));
		this.corrigeMovimiento = false;
	}

	public CrearGrupoDePermisos(permitidos: Discord.Permiso[], denegados: Discord.Permiso[]): Discord.GrupoDePermisos {
		return this.cliente.CrearGrupoDePermisos(permitidos, denegados);
	}
}
