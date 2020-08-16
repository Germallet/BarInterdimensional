import * as discord from "discord.js";

export class ContenidoAdjuntoDiscord {
    private readonly adjunto: discord.MessageAttachment;

    public constructor(adjunto: discord.MessageAttachment) { this.adjunto = adjunto; }

    public ObtenerUrl() {
        return this.adjunto.url;
    }
}