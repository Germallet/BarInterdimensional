import * as Discord from '@discord-api';

export abstract class Bot {
	private readonly bot: Discord.Bot = new Discord.Bot();

	public async Conectarse(token: string) {
		this.EstablecerEventos();
		await this.bot.Conectarse(token);
		this.Conectado();
	}

	protected EstablecerEvento(event: string, listener: any) {
		this.bot.EstablecerEvento(event, listener);
	}

	protected abstract EstablecerEventos(): void;
	protected abstract Conectado(): void;
}
