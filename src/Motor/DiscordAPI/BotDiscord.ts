import * as discord from "discord.js";
import { ClienteDiscord } from "./ClienteDiscord";
import { EstadoDeVozDiscord } from "./EstadoDeVozDiscord";
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
		return this.bot.guilds.cache.get(id);
	}

	public EstablecerEventoNuevoCliente(funcion: (cliente: ClienteDiscord) => void) {
		this.bot.on('guildMemberAdd', (guildmember: discord.GuildMember) => funcion(new ClienteDiscord(guildmember)));
	}

	public EstablecerEventoCambioDeEstadoDeVoz(funcion: (estadoAnterior: EstadoDeVozDiscord, estadoNuevo: EstadoDeVozDiscord) => void) {
		this.bot.on('voiceStateUpdate', (estadoAnterior: discord.VoiceState, estadoNuevo: discord.VoiceState)  => funcion(new EstadoDeVozDiscord(estadoAnterior), new EstadoDeVozDiscord(estadoNuevo)));
	}

	public EstablecerEventoMensajeRecibido(funcion: (mensaje: MensajeDiscord) => void) {
		this.bot.on('message', (message: discord.Message) => funcion(new MensajeDiscord(message)));
	}
}