import { ClienteDiscord } from "./DiscordAPI/ClienteDiscord";

export abstract class Bot {
	private readonly cliente: ClienteDiscord = new ClienteDiscord();

	public async Conectarse(token: string) {
		this.EstablecerEventos();
		await this.cliente.Conectarse(token);
		this.Conectado();
	}

	protected EstablecerEvento(event: string, listener: any) {
		this.cliente.EstablecerEvento(event, listener);
    }
    
	protected abstract EstablecerEventos(): void;
	protected abstract Conectado(): void;
}