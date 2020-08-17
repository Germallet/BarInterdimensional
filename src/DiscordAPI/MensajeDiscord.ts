import * as discord from "discord.js";
import { ContenidoAdjuntoDiscord } from "./ContenidoAdjuntoDiscord";

export class MensajeDiscord {
    private readonly mensaje: discord.Message;

    public constructor(mensaje: discord.Message) { this.mensaje = mensaje; }

    public ObtenerNombreDeAutor(): string {
        return this.mensaje.author.username;
    }
    public ObtenerContenido(): string {
        return this.mensaje.content;
    }

    public ObtenerArchivosAdjuntos(): ContenidoAdjuntoDiscord[] {
        return this.mensaje.attachments.map(adjunto => new ContenidoAdjuntoDiscord(adjunto));
    }

    public ObtenerIdServidor(): string {
		return this.mensaje.guild.id;
	}
}
