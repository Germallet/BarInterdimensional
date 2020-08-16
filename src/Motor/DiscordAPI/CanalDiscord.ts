import * as discord from "discord.js";

export type GrupoDePermisosDiscord = discord.OverwriteResolvable
export type PermisoDiscord = discord.PermissionString

export interface CanalDiscord {
    TieneId(id: string): boolean;
    EsMismoCanal(canal: CanalDiscord): boolean;
}