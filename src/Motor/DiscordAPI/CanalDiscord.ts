import * as discord from "discord.js";
import { CanalDeVozDiscord } from "./CanalDeVozDiscord";
import { CanalDeTextoDiscord } from "./CanalDeTextoDiscord";
import { CategoríaDiscord } from "./CategoríaDiscord";

export type CanalDiscord = CategoríaDiscord | CanalDeVozDiscord | CanalDeTextoDiscord
export type PermisosDeCanal = discord.PermissionOverwriteOptions