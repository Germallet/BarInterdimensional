import * as discord from 'discord.js';
import { CanalDiscord } from './CanalDiscord';
import { ClienteDiscord } from './ClienteDiscord';

export class CanalDeVozDiscord implements CanalDiscord {
	private readonly canal: discord.VoiceChannel;
	private readonly permisos: discord.OverwriteResolvable[] = new Array<discord.OverwriteResolvable>();

	public constructor(canal: discord.VoiceChannel) {
		this.canal = canal;
	}

	public Obtener(): discord.VoiceChannel {
		return this.canal;
	}

	public ObtenerIdServidor(): string {
		return this.canal.guild.id;
	}

	public TieneId(id: string): boolean {
		return this.canal.id === id;
	}

	public async CambiarPermisos(permisos: discord.OverwriteResolvable[]) {
		if (permisos.length != 0 && permisos[0].id != '213823616285016064') return;
		await this.canal.overwritePermissions(permisos);
	}

	public async RemoverPermisos(cliente: ClienteDiscord) {
		await this.canal.permissionOverwrites.get(cliente.ObtenerId()).delete();
	}

	public EsMismoCanal(canal: CanalDiscord): boolean {
		return canal != null && canal.TieneId(this.canal.id);
	}
}