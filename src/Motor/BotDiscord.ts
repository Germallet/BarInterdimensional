import * as discord from "discord.js";

export abstract class BotDiscord {
	private readonly cliente: discord.Client = new discord.Client();

	public async Conectarse(token: string) {
        this.EstablecerEvento('ready', this.Conectado);
		this.EstablecerEventos();
		await this.cliente.login(token);
	}

	protected EstablecerEvento(event: string, listener: any) {
		this.cliente.on(event, listener);
	}

	protected async ObtenerGuild(id: string): Promise<discord.Guild> {
		return this.cliente.guilds.get(id);
	}

	protected abstract EstablecerEventos(): void;
	protected abstract Conectado(): void;
}