import * as discord from "discord.js";

export class CategoríaDiscord {
    private readonly categoría: discord.CategoryChannel;

    public constructor(categoría: discord.CategoryChannel) { this.categoría = categoría; }

    public Obtener(): discord.CategoryChannel {
        return this.categoría;
    }
}