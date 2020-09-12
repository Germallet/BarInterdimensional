import * as discord from 'discord.js';
import { ClienteDiscord } from './ClienteDiscord';

export class CanalDiscord<T extends discord.GuildChannel> {
	protected readonly canal: T;
	private permisos: discord.OverwriteResolvable[] = new Array<discord.OverwriteResolvable>();

	public constructor(canal: T) {
		this.canal = canal;
	}

	public Obtener(): T {
		return this.canal;
	}

	public ObtenerId(): string {
		return this.canal.id;
	}

	public ObtenerIdServidor(): string {
		return this.canal.guild.id;
	}

	public TieneId(id: string): boolean {
		return this.ObtenerId() === id;
	}

	public async CambiarPermisos(permiso: discord.OverwriteResolvable): Promise<void> {
		this.permisos = this.permisos.filter((permisoAFiltrar) => permisoAFiltrar.id != permiso.id);
		this.permisos.push(permiso);
		await this.canal.overwritePermissions(this.permisos);
	}

	public async RemoverPermisos(cliente: ClienteDiscord): Promise<void> {
		await this.canal.permissionOverwrites.get(cliente.ObtenerId())?.delete();
	}

	public EsMismoCanal(canal: CanalDiscord<T>): boolean {
		return canal != null && canal.TieneId(this.ObtenerId());
	}
}
