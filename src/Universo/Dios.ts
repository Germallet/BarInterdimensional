import * as Discord from '#discord-api';
import { Usuario } from '#usuario';
import { Universo } from './Universo';
import { Mundo } from './Mundo';
import { Consola } from '../Consola';
import { GestorDeComandos } from '../Bot/GestorDeComandos';
import { ComandoFinal } from '#bot';
import { GeneradorXML } from 'Persistencia/GeneradorXML';

export class Dios {
	private readonly bot: Discord.Bot = new Discord.Bot();
	private readonly gestorDeComandos: GestorDeComandos = new GestorDeComandos('-');

	public constructor() {
		this.AgregarComandos();
	}

	public async Conectarse(): Promise<void> {
		this.EstablecerEventos();
		await this.bot.Conectarse(process.env.DISCORD_BOT_TOKEN);
		this.Conectado();
	}

	private EstablecerEventos(): void {
		this.bot.EstablecerEventoNuevoCliente((cliente: Discord.Cliente) => this.CrearPerfil(cliente));
		this.bot.EstablecerEventoCambioDeEstadoDeVoz((estadoAnterior: Discord.EstadoDeVoz, estadoNuevo: Discord.EstadoDeVoz) => this.CambioDeEstadoDeVoz(estadoAnterior, estadoNuevo));
		this.bot.EstablecerEventoMensajeRecibido((mensaje: Discord.Mensaje) => this.MensajeRecibido(mensaje));
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
		const usuario = Universo.Usuarios().ObtenerOCrearUsuario(estadoNuevo.ObtenerCliente());

		if (canalNuevo == null || !canalNuevo.EsMismoCanal(canalAnterior)) {
			const origen = Universo.Mundos().ObtenerNodo(canalAnterior);
			const destino = Universo.Mundos().ObtenerNodo(canalNuevo);
			await usuario.Moverse(origen, destino);
		}
	}

	private async MensajeRecibido(mensaje: Discord.Mensaje): Promise<void> {
		Consola.Normal('[DISCORD]', `${mensaje.ObtenerNombreDeAutor()}: ${mensaje.ObtenerContenido()}`);
		this.gestorDeComandos.LeerComando(mensaje.ObtenerContenido(), mensaje);
	}

	public async ObtenerServidor(id: string): Promise<Discord.Servidor> {
		return this.bot.ObtenerServidor(id);
	}

	//======================== COMANDOS ========================//
	private AgregarComandos(): void {
		this.gestorDeComandos.AgregarComando(new ComandoFinal(['CargarMundo'], this.CargarMundo));
	}

	private async CargarMundo(parámetros: Array<string>, mensaje: Discord.Mensaje): Promise<void> {
		const adjuntos: Array<Discord.ArchivoAdjunto> = mensaje.ObtenerArchivosAdjuntos();
		if (parámetros.length != 0) throw new Error(`El comando -CargarMundo recibe parámetros y no espera ninguno`); // MEDIO AL PEDO TODOS ESTOS CHECKS PERO ESTE MÁS
		if (adjuntos.length > 1) throw new Error(`El comando -CargarMundo recibe más de un archivo adjunto`);
		if (adjuntos.length == 0) throw new Error(`El comando -CargarMundo espera un archivo adjunto y no recibe ninguni`);

		try {
			new GeneradorXML(await adjuntos[0].Leer()).Generar();
		} catch (error) {
			await mensaje.Responder(`Error al cargar mundo: ${error}`);
		}
	}
}
