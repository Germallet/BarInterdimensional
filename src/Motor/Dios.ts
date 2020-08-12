import * as discord from "discord.js";
import { Usuario } from "./Usuario";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";
import { ClienteDiscord } from "./ClienteDiscord";
import { Universo } from "./Universo";
import { ArchivoWeb } from "./ArchivoWeb";
import { Configuración } from "./Configuración";

export class Dios {
	private readonly cliente: ClienteDiscord = new ClienteDiscord();

	public async Conectarse() {
		this.EstablecerEventos();
		await this.cliente.Conectarse(process.env.DISCORD_BOT_TOKEN);
		this.Conectado();
	}

	private EstablecerEventos() {
		this.cliente.EstablecerEvento('guildMemberAdd', this.CrearPerfil);
		this.cliente.EstablecerEvento('voiceStateUpdate', this.CambioDeEstadoDeVoz);
		this.cliente.EstablecerEvento('message', this.MensajeRecibido);
	}

	protected async Conectado() {
		Consola.Normal('[DISCORD]', 'Conectado!');
        await Universo.Mundos().CargarMundos();
	}

	private async CrearPerfil(miembro: discord.GuildMember) {
		const mundo: Mundo = Universo.Mundos().ObtenerMundo(miembro.guild);
		const usuario: Usuario = Universo.Usuarios().ObtenerOCrearUsuario(miembro);
		await mundo.CrearPerfil(usuario);
	}

	private CambioDeEstadoDeVoz(estadoAnterior: discord.GuildMember, estadoActual: discord.GuildMember) {
		const canalAnterior = estadoAnterior.voiceChannel;
		const canalActual = estadoActual.voiceChannel;

		if (canalAnterior !== canalActual)
		{
			const usuario = Universo.Usuarios().ObtenerOCrearUsuario(estadoActual);
			const nodo = Universo.Mundos().ObtenerNodo(canalActual);
			if(nodo != null) 
				usuario.MoverseA(nodo);
		}	
	}

	private async MensajeRecibido(mensaje: discord.Message, cliente: discord.Client) {
		Consola.Normal('[DISCORD]', `${mensaje.author.username}: ${mensaje.content}`);

		if (mensaje.content == '-CrearMundo' && mensaje.attachments.size == 1) {
			const adjunto: discord.MessageAttachment = mensaje.attachments.first();

			const contenidoArchivo: string = await new ArchivoWeb().Leer(adjunto.url);
			const configuración: Configuración = new Configuración(contenidoArchivo);

			Universo.Mundos().ObtenerMundo(mensaje.guild).Generar(configuración);
		}
	}

	public async ObtenerGuild(id: string): Promise<discord.Guild> {
		return this.cliente.ObtenerGuild(id);
	}
}