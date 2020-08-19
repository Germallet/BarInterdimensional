import * as discord from 'discord.js';
import { CanalDiscord } from './CanalDiscord';
import { ClienteDiscord } from './ClienteDiscord';

export class CanalDeTextoDiscord implements CanalDiscord {
	private readonly canal: discord.TextChannel;
	private permisos: discord.OverwriteResolvable[] = new Array<discord.OverwriteResolvable>();

	public constructor(canal: discord.TextChannel) {
		this.canal = canal;
	}

	public Obtener(): discord.TextChannel {
		return this.canal;
	}

	public ObtenerIdServidor(): string {
		return this.canal.guild.id;
	}

	public TieneId(id: string): boolean {
		return this.canal.id === id;
	}

	public async CambiarPermisos(permiso: discord.OverwriteResolvable): Promise<void> {
		this.permisos = this.permisos.filter((permisoAFiltrar) => permisoAFiltrar.id != permiso.id);
		this.permisos.push(permiso);
		await this.canal.overwritePermissions(this.permisos);
	}

	public async RemoverPermisos(cliente: ClienteDiscord): Promise<void> {
		await this.canal.permissionOverwrites.get(cliente.ObtenerId()).delete();
	}

	public EsMismoCanal(canal: CanalDiscord): boolean {
		return canal != undefined && canal.TieneId(this.canal.id);
	}
}
