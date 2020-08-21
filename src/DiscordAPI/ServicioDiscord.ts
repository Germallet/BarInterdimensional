import * as discord from 'discord.js';

export class ServicioDiscord {
	public static CrearCliente(): discord.Client {
		return new discord.Client();
	}

	public static ReemplazarInstanciador(instanciador: () => discord.Client): void {
		this.CrearCliente = instanciador;
	}
}
