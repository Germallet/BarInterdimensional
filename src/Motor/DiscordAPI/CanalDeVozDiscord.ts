import * as discord from "discord.js";

export class CanalDeVozDiscord {
    private readonly canal: discord.VoiceChannel;

    public constructor(canal: discord.VoiceChannel) { this.canal = canal; }

    public Obtener(): discord.VoiceChannel {
        return this.canal;
    }

    public TieneId(id: string): boolean {
        return this.canal.id === id;
    }

    public async CambiarPermisos(rol: discord.Role, permisos: discord.PermissionOverwriteOptions) {
        this.canal.overwritePermissions(rol, permisos);
    }
}