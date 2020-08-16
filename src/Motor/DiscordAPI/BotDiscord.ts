import * as discord from "discord.js";
import { ClienteDiscord } from "./ClienteDiscord";
import { MensajeDiscord } from "./MensajeDiscord";

export class BotDiscord {
	private readonly bot: discord.Client = new discord.Client();

	public async Conectarse(token: string) {
		await this.bot.login(token);
	}

	public EstablecerEvento(event: string, listener: any) {
		this.bot.on(event, listener);
	}

	public async ObtenerGuild(id: string): Promise<discord.Guild> {
		return this.bot.guilds.get(id);
	}

	public EstablecerEventoNuevoCliente(funcion: (cliente: ClienteDiscord) => void) {
		this.bot.on('guildMemberAdd', (guildmember: discord.GuildMember) => funcion(new ClienteDiscord(guildmember)));
	}

	public EstablecerEventoCambioDeEstadoDeVoz(funcion: (cliente1: ClienteDiscord, cliente2: ClienteDiscord) => void) {
		this.bot.on('voiceStateUpdate', (guildmember1: discord.GuildMember, guildmember2: discord.GuildMember)  => funcion(new ClienteDiscord(guildmember1), new ClienteDiscord(guildmember2)));
	}

	public EstablecerEventoMensajeRecibido(funcion: (mensaje: MensajeDiscord) => void) {
		this.bot.on('message', (message: discord.Message, client: discord.Client) => funcion(new MensajeDiscord(message)));
	}
}