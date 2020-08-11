import * as discord from "discord.js";
import { Usuario } from "./Usuario";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";
import { BotDiscord } from "./BotDiscord";
import { Universo } from "./Universo";
import { ArchivoWeb } from "./ArchivoWeb";
import { Configuración } from "./Configuración";

export class Dios extends BotDiscord {
	private readonly usuarios: Array<Usuario> = new Array<Usuario>();

	protected EstablecerEventos() {
		this.EstablecerEvento('guildMemberAdd', this.CrearPerfil);
		this.EstablecerEvento('voiceStateUpdate', this.CambioDeEstadoDeVoz);
		this.EstablecerEvento('message', this.MensajeRecibido);
	}

	protected async Conectado() {
		Consola.Normal('[DISCORD]', 'Conectado!');

		const guild: discord.Guild = await super.ObtenerGuild('740670067125125133');
        await Universo.Mundos().CrearMundo(guild);
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
}