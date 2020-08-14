import * as discord from "discord.js";

export class ClienteDiscord {
	private readonly cliente: discord.Client = new discord.Client();

	public async Conectarse(token: string) {
		await this.cliente.login(token);
	}

	public EstablecerEvento(event: string, listener: any) {
		this.cliente.on(event, listener);
	}

	public async ObtenerGuild(id: string): Promise<discord.Guild> {
		return this.cliente.guilds.get(id);
	}
}