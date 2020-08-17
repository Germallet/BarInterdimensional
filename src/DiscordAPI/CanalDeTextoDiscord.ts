import * as discord from "discord.js";
import { CanalDiscord } from "./CanalDiscord";
import { RolDiscord } from "./RolDiscord";

export class CanalDeTextoDiscord implements CanalDiscord{
    private readonly canal: discord.TextChannel;

    public constructor(canal: discord.TextChannel) { this.canal = canal; }

    public Obtener(): discord.TextChannel {
        return this.canal;
    }

    public ObtenerIdServidor(): string {
        return this.canal.guild.id
    }

    public TieneId(id: string): boolean {
        return this.canal.id === id;
    }

    public async CambiarPermisos(permisos: discord.OverwriteResolvable[]) {
        this.canal.overwritePermissions(permisos);
    }

    public EsMismoCanal(canal: CanalDiscord): boolean {
        return canal != undefined && canal.TieneId(this.canal.id);
    }
}