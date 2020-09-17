import * as discord from 'discord.js';
import { ArchivoAdjuntoDiscord } from './ArchivoAdjuntoDiscord';

export class MensajeDiscord {
	private readonly mensaje: discord.Message;

	public constructor(mensaje: discord.Message) {
		this.mensaje = mensaje;
	}

	public ObtenerNombreDeAutor(): string {
		return this.mensaje.author.username;
	}
	public ObtenerContenido(): string {
		return this.mensaje.content;
	}

	public ObtenerArchivosAdjuntos(): ArchivoAdjuntoDiscord[] {
		return this.mensaje.attachments.map((adjunto) => new ArchivoAdjuntoDiscord(adjunto));
	}

	public async Responder(contenido: string): Promise<void> {
		await this.mensaje.channel.send(contenido);
	}
}
