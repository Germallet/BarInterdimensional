import * as discord from "discord.js";

export class BotDiscord {
	private readonly cliente: discord.Client = new discord.Client();

	public Conectarse(): void {
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);
		this.cliente.login(process.env.DISCORD_BOT_TOKEN);
	}

	private OnReady() {
		console.log('Conectado!');
	}
	private async OnMessage(message: discord.Message, client: discord.Client) {
		console.log(`Nuevo mensaje: ${message.content}`);
	}
}