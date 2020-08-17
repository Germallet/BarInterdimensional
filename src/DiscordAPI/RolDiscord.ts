import * as discord from "discord.js";
import { GrupoDePermisosDiscord, PermisoDiscord } from "./PermisosDiscord";

export class RolDiscord {
    private readonly rol: discord.Role;

    public constructor(rol: discord.Role) { this.rol = rol; }

    public Obtener(): discord.Role {
        return this.rol;
    }

    public CrearGrupoDePermisos(permitidos: PermisoDiscord[], denegados: PermisoDiscord[]): GrupoDePermisosDiscord {
        return {
            id: this.rol.id,
            allow: permitidos,
            deny: denegados
        };
    }
}
