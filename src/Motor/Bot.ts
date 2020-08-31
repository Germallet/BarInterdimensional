import * as Discord from '#discord-api';
import { GestorDeComandos } from './Comandos/GestorDeComandos';

export abstract class Bot {
	private readonly bot: Discord.Bot = new Discord.Bot();
	private readonly gestorDeComandos: GestorDeComandos = new GestorDeComandos('-');

	public async Conectarse(token: string): Promise<void> {
		this.bot.EstablecerEventoMensajeRecibido(this.LeerComando);
		this.EstablecerEventos();
		await this.bot.Conectarse(token);
		this.Conectado();
	}

	protected EstablecerEvento(event: string, listener: any): void {
		this.bot.EstablecerEvento(event, listener);
	}

	protected abstract EstablecerEventos(): void;
	protected abstract Conectado(): void;

	private async LeerComando(mensaje: Discord.Mensaje): Promise<void> {
		return this.gestorDeComandos.LeerComando(mensaje.ObtenerContenido(), mensaje.ObtenerArchivosAdjuntos());
	}
}
