import * as Discord from '../DiscordAPI/index';
import { Usuario } from './Usuario';
import { Mundo } from './Mundo';
import { Consola } from './Consola';
import { Universo } from './Universo';
import { ArchivoWeb } from './ArchivoWeb';
import { Configuración } from './Configuración';

export class Dios {
	private readonly bot: Discord.Bot = new Discord.Bot();

	public async Conectarse(): Promise<void> {
		this.EstablecerEventos();
		await this.bot.Conectarse(process.env.DISCORD_BOT_TOKEN);
		this.Conectado();
	}

	private EstablecerEventos(): void {
		this.bot.EstablecerEventoNuevoCliente(this.CrearPerfil);
		this.bot.EstablecerEventoCambioDeEstadoDeVoz(this.CambioDeEstadoDeVoz);
		this.bot.EstablecerEventoMensajeRecibido(this.MensajeRecibido);
	}

	protected async Conectado(): Promise<void> {
		Consola.Normal('[DISCORD]', 'Conectado!');
		await Universo.Mundos().CargarMundos();
	}

	private async CrearPerfil(cliente: Discord.Cliente): Promise<void> {
		const mundo: Mundo = Universo.Mundos().ObtenerMundo(cliente.ObtenerIdServidor());
		const usuario: Usuario = Universo.Usuarios().ObtenerOCrearUsuario(cliente);
		await mundo.CrearPerfil(usuario);
	}

	private async CambioDeEstadoDeVoz(estadoAnterior: Discord.EstadoDeVoz, estadoNuevo: Discord.EstadoDeVoz): Promise<void> {
		const canalAnterior = estadoAnterior.ObtenerCanalDeVoz();
		const canalNuevo = estadoNuevo.ObtenerCanalDeVoz();

		if (canalNuevo == null || !canalNuevo.EsMismoCanal(canalAnterior)) {
			const usuario = Universo.Usuarios().ObtenerOCrearUsuario(estadoNuevo.ObtenerCliente());
			const origen = Universo.Mundos().ObtenerNodo(canalAnterior);
			const destino = Universo.Mundos().ObtenerNodo(canalNuevo);
			await usuario.Moverse(origen, destino);
		}
	}

	private async MensajeRecibido(mensaje: Discord.Mensaje): Promise<void> {
		Consola.Normal('[DISCORD]', `${mensaje.ObtenerNombreDeAutor()}: ${mensaje.ObtenerContenido()}`);

		if (mensaje.ObtenerContenido() == '--Generar' && mensaje.ObtenerArchivosAdjuntos().length == 1) {
			const adjunto: Discord.ContenidoAdjunto = mensaje.ObtenerArchivosAdjuntos()[0];

			const contenidoArchivo: string = await new ArchivoWeb().Leer(adjunto.ObtenerUrl());
			const configuración: Configuración = new Configuración(contenidoArchivo);

			Universo.Mundos().ObtenerMundo(mensaje.ObtenerIdServidor()).Generar(configuración);
		}
	}

	public async ObtenerServidor(id: string): Promise<Discord.Servidor> {
		return this.bot.ObtenerServidor(id);
	}
}
