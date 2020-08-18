import * as Discord from '../DiscordAPI/index';
import { Perfil } from './Perfil';
import { Mundo } from './Mundo';
import { Nodo } from './Nodo';

export class Usuario {
	private readonly cliente: Discord.Cliente;
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();

	public constructor(cliente: Discord.Cliente) {
		this.cliente = cliente;
	}

	public AgregarPerfil(perfil: Perfil) {
		this.perfiles.push(perfil);
	}

	private ObtenerPerfil(mundo: Mundo): Perfil {
		return this.perfiles.find((perfil) => perfil.EsDeMundo(mundo));
	}

	public ObtenerCliente(): Discord.Cliente {
		return this.cliente;
	}

	public TieneId(id: string) {
		return this.cliente.TieneId(id);
	}

	public EsCliente(cliente: Discord.Cliente) {
		return this.cliente.EsMismosCliente(cliente);
	}

	public async Moverse(origen: Nodo, destino: Nodo) {
		const mundo: Mundo = origen == null ? destino.ObtenerMundo() : origen.ObtenerMundo();
		const perfil: Perfil = this.ObtenerPerfil(mundo);
		return perfil.Moverse(origen, destino);
	}

	public CrearGrupoDePermisos(permitidos: Discord.Permiso[], denegados: Discord.Permiso[]): Discord.GrupoDePermisos {
		return this.cliente.CrearGrupoDePermisos(permitidos, denegados);
	}

	public async AgregarRol(rol: Discord.Rol) {
		this.cliente.AgregarRol(rol);
	}
	public async RemoverRol(rol: Discord.Rol) {
		this.cliente.RemoverRol(rol);
	}
}
