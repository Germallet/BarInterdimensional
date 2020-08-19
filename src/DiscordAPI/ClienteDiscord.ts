import * as discord from 'discord.js';
import { RolDiscord } from './RolDiscord';
import { GrupoDePermisosDiscord, PermisoDiscord } from './PermisosDiscord';
import { CanalDeVozDiscord } from './CanalDeVozDiscord';

export class ClienteDiscord {
	private readonly cliente: discord.GuildMember;

	public constructor(cliente: discord.GuildMember) {
		this.cliente = cliente;
	}

	public ObtenerIdServidor(): string {
		return this.cliente.guild.id;
	}

	public ObtenerId(): string {
		return this.cliente.id;
	}

	public TieneId(id: string): boolean {
		return this.cliente.id === id;
	}

	public EsMismosCliente(cliente: ClienteDiscord): boolean {
		return cliente.TieneId(this.cliente.id);
	}

	public CrearGrupoDePermisos(permitidos: PermisoDiscord[], denegados: PermisoDiscord[]): GrupoDePermisosDiscord {
		return {
			id: this.cliente.id,
			allow: permitidos,
			deny: denegados
		};
	}

	public async CambiarCanalDeVoz(canal: CanalDeVozDiscord): Promise<void> {
		await this.cliente.voice.setChannel(canal.Obtener());
	}

	public AgregarRol(rol: RolDiscord): void {
		this.cliente.roles.add(rol.Obtener());
	}

	public RemoverRol(rol: RolDiscord): void {
		this.cliente.roles.remove(rol.Obtener());
	}
}
