import * as discord from 'discord.js';
import { CanalDiscord } from './CanalDiscord';

export class CanalDeVozDiscord implements CanalDiscord {
	private readonly canal: discord.VoiceChannel;

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
		this.canal.overwritePermissions(permisos);
	}

	public EsMismoCanal(canal: CanalDiscord): boolean {
		return canal != null && canal.TieneId(this.canal.id);
	}
}
