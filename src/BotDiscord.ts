import * as discord from "discord.js";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";

export class BotDiscord {
	private readonly cliente: discord.Client = new discord.Client();
	private readonly mundos: Array<Mundo> = new Array<Mundo>();

	public async Conectarse() {
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);

		this.cliente.on('voiceStateUpdate', (miembroAnterior, miembroActual) => {
			if (miembroAnterior.guild !== miembroActual.guild) {
				this.ObtenerMundo(miembroAnterior.guild)?.Desconexión(miembroAnterior);
				this.ObtenerMundo(miembroActual.guild)?.Conexión(miembroActual);
			}
			else {
				const canalViejo = miembroAnterior.voiceChannel;
				const canalNuevo = miembroActual.voiceChannel;

				if (canalViejo !== canalNuevo)
					this.ObtenerMundo(miembroActual.guild)?.TransladoDeCanal(miembroActual, canalViejo, canalNuevo);
			}
		})

		await this.cliente.login(process.env.DISCORD_BOT_TOKEN); // PROMESA

		this.CrearMundos();
	}

	private OnReady() {
		Consola.Normal('[DISCORD]', 'Conectado!');
	}
	private async OnMessage(message: discord.Message, client: discord.Client) {
		Consola.Normal('[DISCORD]', `${message.author.username}: ${message.content}`);
	}

	private ObtenerMundo(guild: discord.Guild) {
		return this.mundos.find(mundo => mundo.EsGuild(guild));
	}
	private async CrearMundos() {
		this.mundos.push(new Mundo(this.cliente.guilds.get('697583698387664996')));
		await Promise.all(this.mundos.map(mundo => mundo.Generar()));
	}
}