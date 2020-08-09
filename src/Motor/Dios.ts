import * as discord from "discord.js";
import { Usuario } from "./Usuario";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";
import { BotDiscord } from "./BotDiscord";

export class Dios extends BotDiscord {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();
	private readonly usuarios: Array<Usuario> = new Array<Usuario>();

	protected EstablecerEventos() {
        this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);

		this.cliente.on('guildMemberAdd', miembro => {
			this.CrearPerfil(miembro, this.ObtenerMundo(miembro.guild));
		});
	
		this.cliente.on('voiceStateUpdate', (estadoAnterior, estadoActual) => {
			const canalAnterior = estadoAnterior.voiceChannel;
			const canalActual = estadoActual.voiceChannel;

			if (canalAnterior !== canalActual)
			{
				const usuario = this.ObtenerOCrearUsuario(estadoActual);
				const nodo = this.ObtenerNodo(canalActual);
				if(nodo != null) 
					usuario.MoverseA(nodo);
			}	
		})
    }
	protected AlConcectarse() {
        this.CrearMundos();
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

	private OnReady() {
		Consola.Normal('[DISCORD]', 'Conectado!');
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
		const guild: discord.Guild = this.cliente.guilds.get(id);
		const mundo: Mundo = new Mundo(guild);
		await mundo.Generar();
		await Promise.all(guild.members.map(miembro => this.CrearPerfil(miembro, mundo)));
		this.mundos.push(mundo);
	}

	public async ObtenerGuild(): Promise<discord.Guild> {
		return this.cliente.guilds.get('740670067125125133');
    }

	private async CrearMundos() {
		await this.CrearMundo('740670067125125133');
		//await Promise.all(this.guildsId.map(guildId => this.CrearMundo(guildId));
	}
}