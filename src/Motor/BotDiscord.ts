import * as discord from "discord.js";

export abstract class BotDiscord {
	protected readonly cliente: discord.Client = new discord.Client();

	public async Conectarse(token: string) {
		this.EstablecerEventos();
		await this.cliente.login(token);
		this.AlConcectarse();
	}

	protected abstract EstablecerEventos(): void;
	protected abstract AlConcectarse(): void;
}