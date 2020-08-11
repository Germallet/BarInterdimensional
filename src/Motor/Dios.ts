import * as discord from "discord.js";
import { Usuario } from "./Usuario";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";
import { BotDiscord } from "./BotDiscord";

export class Dios extends BotDiscord {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();
	private readonly usuarios: Array<Usuario> = new Array<Usuario>();

	protected EstablecerEventos() {
		this.EstablecerEvento('message', this.OnMessage);
		this.EstablecerEvento('guildMemberAdd', this.NuevoPerfil);		
		this.EstablecerEvento('voiceStateUpdate', this.CambioDeEstadoDeVoz);
	}

	private NuevoPerfil(miembro: discord.GuildMember) {
		this.CrearPerfil(miembro, this.ObtenerMundo(miembro.guild));
	}
	private CambioDeEstadoDeVoz(estadoAnterior: discord.GuildMember, estadoActual: discord.GuildMember) {
		const canalAnterior = estadoAnterior.voiceChannel;
		const canalActual = estadoActual.voiceChannel;

		if (canalAnterior !== canalActual)
		{
			const usuario = this.ObtenerOCrearUsuario(estadoActual);
			const nodo = this.ObtenerNodo(canalActual);
			if(nodo != null) 
				usuario.MoverseA(nodo);
		}	
	}

	private TieneUsuario(miembro: discord.GuildMember) {
		return this.usuarios.some(usuario => usuario.esMiembro(miembro));
	}

	private CrearUsuario(miembro: discord.GuildMember){
		const nuevoUsuario: Usuario = new Usuario(miembro);
		this.usuarios.push(nuevoUsuario);
	}

	private async CrearPerfil(miembro: discord.GuildMember, mundo: Mundo){
		const usuario: Usuario = this.ObtenerOCrearUsuario(miembro);
		await mundo.CrearPerfil(usuario);
	}

	private ObtenerOCrearUsuario(miembro: discord.GuildMember): Usuario{
		if(!this.TieneUsuario(miembro))
			this.CrearUsuario(miembro);
		return this.usuarios.find(usuario => usuario.esMiembro(miembro));
	}

	protected Conectado() {
		Consola.Normal('[DISCORD]', 'Conectado!');
		this.CrearMundos();
	}
	private async OnMessage(message: discord.Message, client: discord.Client) {
		Consola.Normal('[DISCORD]', `${message.author.username}: ${message.content}`);
	}

	public ObtenerMundo(guild: discord.Guild) {
		return this.mundos.find(mundo => mundo.EsGuild(guild));
	}

	private ObtenerNodo(canal: discord.VoiceChannel) {
		if(canal==undefined)
			return null;
		const mundo: Mundo = this.ObtenerMundo(canal.guild);
        return mundo != undefined ? mundo.ObtenerNodo(canal) : null;
    }

	private async CrearMundo(id: string) {
		const guild: discord.Guild = await this.ObtenerGuild(id);
		const mundo: Mundo = new Mundo(guild);
		await mundo.Generar();
		await Promise.all(guild.members.map(miembro => this.CrearPerfil(miembro, mundo)));
		this.mundos.push(mundo);
	}

	private async CrearMundos() {
		await this.CrearMundo('740670067125125133');
		//await Promise.all(this.guildsId.map(guildId => this.CrearMundo(guildId));
	}
}