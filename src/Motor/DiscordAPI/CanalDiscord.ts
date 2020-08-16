import * as discord from "discord.js";

export type PermisosDeCanal = discord.PermissionOverwriteOptions

export interface CanalDiscord {
    TieneId(id: string): boolean;
    EsMismoCanal(canal: CanalDiscord): boolean;
}