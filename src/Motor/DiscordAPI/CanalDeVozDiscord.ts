import * as discord from "discord.js";

export class CanalDeVozDiscord {
    private readonly canal: discord.VoiceChannel;

    public constructor(canal: discord.VoiceChannel) { this.canal = canal; }
}