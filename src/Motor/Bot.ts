import { BotDiscord } from "./DiscordAPI/BotDiscord";

export abstract class Bot {
	private readonly bot: BotDiscord = new BotDiscord();

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