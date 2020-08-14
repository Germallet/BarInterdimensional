import * as discord from "discord.js";

export class CanalDeTextoDiscord {
    private readonly canal: discord.TextChannel;

    public constructor(canal: discord.TextChannel) { this.canal = canal; }

    public Obtener(): discord.TextChannel {
        return this.canal;
    }

    public TieneId(id: string): boolean {
        return this.canal.id === id;
    }

    public async CambiarPermisos(rol: discord.Role, permisos: discord.PermissionOverwriteOptions) {
        this.canal.overwritePermissions(rol, permisos);
    }
}