import * as discord from "discord.js";
import { CanalDiscord } from "./CanalDiscord";

export class CategoríaDiscord implements CanalDiscord {
    private readonly categoría: discord.CategoryChannel;

    public constructor(categoría: discord.CategoryChannel) { this.categoría = categoría; }

    public Obtener(): discord.CategoryChannel {
        return this.categoría;
    }

    public TieneId(id: string): boolean {
        return this.categoría.id === id;
    }

    public EsMismoCanal(canal: CanalDiscord): boolean {
        return canal != undefined && canal.TieneId(this.categoría.id);
    }
}