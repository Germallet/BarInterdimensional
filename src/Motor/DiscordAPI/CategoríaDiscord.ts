import * as discord from "discord.js";

export class CategoríaDiscord {
    private readonly categoría: discord.CategoryChannel;

    public constructor(categoría: discord.CategoryChannel) { this.categoría = categoría; }

    public Obtener(): discord.CategoryChannel {
        return this.categoría;
    }

    public TieneId(id: string): boolean {
        return this.categoría.id === id;
    }
}