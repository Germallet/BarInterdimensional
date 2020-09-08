import * as discord from 'discord.js';
import * as WebRequest from 'web-request';

export class ContenidoAdjuntoDiscord {
	private readonly adjunto: discord.MessageAttachment;

	public constructor(adjunto: discord.MessageAttachment) {
		this.adjunto = adjunto;
	}

	public async Leer(): Promise<string> {
		return (await WebRequest.get(this.adjunto.url)).content;
	}
}
