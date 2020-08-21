import * as discord from 'discord.js';
import { ClienteDiscord } from './ClienteDiscord';
import { EstadoDeVozDiscord } from './EstadoDeVozDiscord';
import { MensajeDiscord } from './MensajeDiscord';
import { ServidorDiscord } from './ServidorDiscord';
import { ServicioDiscord } from './ServicioDiscord';

export class BotDiscord {
	private readonly bot: discord.Client = ServicioDiscord.CrearCliente();

	public async Conectarse(token: string): Promise<void> {
		await this.bot.login(token);
	}

	public EstablecerEvento(event: string, listener: any): void {
		this.bot.on(event, listener);
	}

	public async ObtenerServidor(id: string): Promise<ServidorDiscord> {
		return new ServidorDiscord(this.bot.guilds.cache.get(id));
	}

	public EstablecerEventoNuevoCliente(funcion: (cliente: ClienteDiscord) => void): void {
		this.bot.on('guildMemberAdd', (guildmember: discord.GuildMember) => funcion(new ClienteDiscord(guildmember)));
	}

	public EstablecerEventoCambioDeEstadoDeVoz(funcion: (estadoAnterior: EstadoDeVozDiscord, estadoNuevo: EstadoDeVozDiscord) => void): void {
		this.bot.on('voiceStateUpdate', (estadoAnterior: discord.VoiceState, estadoNuevo: discord.VoiceState) => funcion(new EstadoDeVozDiscord(estadoAnterior), new EstadoDeVozDiscord(estadoNuevo)));
	}

	public EstablecerEventoMensajeRecibido(funcion: (mensaje: MensajeDiscord) => void): void {
		this.bot.on('message', (message: discord.Message) => funcion(new MensajeDiscord(message)));
	}
}
