import * as discord from "discord.js";

export class RolDiscord {
    private readonly rol: discord.Role;

    public constructor(rol: discord.Role) { this.rol = rol; }

    public Obtener(): discord.Role {
        return this.rol;
    }
}
