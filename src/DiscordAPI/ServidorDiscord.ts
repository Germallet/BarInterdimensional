import * as discord from 'discord.js';
import { CanalDeVozDiscord } from './CanalDeVozDiscord';
import { CanalDeTextoDiscord } from './CanalDeTextoDiscord';
import { CategoríaDiscord } from './CategoríaDiscord';
import { RolDiscord } from './RolDiscord';
import { ClienteDiscord } from './ClienteDiscord';

export class ServidorDiscord {
	private readonly servidor: discord.Guild;

	public constructor(guild: discord.Guild) {
		this.servidor = guild;
	}

	public ObtenerNombre(): string {
		return this.servidor.name;
	}

	public ObtenerClientes(): ClienteDiscord[] {
		return this.servidor.members.cache.array().map((guildmember) => new ClienteDiscord(guildmember));
	}

	public TieneId(id: string): boolean {
		return this.servidor.id === id;
	}

	private async CrearCanal<T>(nombre: string, opciones: discord.GuildCreateChannelOptions, creador: (canal: discord.ChannelResolvable) => T): Promise<T> {
		const copiaServidor: discord.Guild = this.servidor;
		return new Promise(function (resolver, rechazar) {
			copiaServidor.channels.create(nombre, opciones).then(function (resultado: discord.ChannelResolvable) {
				resolver(creador(resultado));
			}, rechazar);
		});
	}

	public async CrearCategoría(nombre: string): Promise<CategoríaDiscord> {
		return this.CrearCanal(nombre, { type: 'category' }, (canal) => new CategoríaDiscord(canal as discord.CategoryChannel));
	}

	public async CrearCanalDeTexto(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeTextoDiscord> {
		return this.CrearCanal(nombre, { type: 'text', parent: categoría.Obtener() }, (canal) => new CanalDeTextoDiscord(canal as discord.TextChannel));
	}

	public async CrearCanalDeVoz(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeVozDiscord> {
		return this.CrearCanal(nombre, { type: 'voice', parent: categoría.Obtener() }, (canal) => new CanalDeVozDiscord(canal as discord.VoiceChannel));
	}

	public ObtenerCategoría(id: string): CategoríaDiscord {
		const canal: discord.CategoryChannel = this.servidor.channels.cache.get(id) as discord.CategoryChannel;
		if (canal == undefined) throw new Error(`No se pudo obtener la categoría ${id}`);
		return new CategoríaDiscord(canal);
	}

	public ObtenerCanalDeTexto(id: string): CanalDeTextoDiscord {
		const canal: discord.TextChannel = this.servidor.channels.cache.get(id) as discord.TextChannel;
		if (canal == undefined) throw new Error(`No se pudo obtener el canal de texto ${id}`);
		return new CanalDeTextoDiscord(canal);
	}

	public ObtenerCanalDeVoz(id: string): CanalDeVozDiscord {
		const canal: discord.VoiceChannel = this.servidor.channels.cache.get(id) as discord.VoiceChannel;
		if (canal == undefined) throw new Error(`No se pudo obtener el canal de voz ${id}`);
		return new CanalDeVozDiscord(canal);
	}

	public async CrearRol(datos: discord.RoleData): Promise<RolDiscord> {
		const copiaServidor: discord.Guild = this.servidor;
		return new Promise(function (resolver, rechazar) {
			copiaServidor.roles.create({ data: datos }).then(function (resultado: discord.Role) {
				resolver(new RolDiscord(resultado));
			}, rechazar);
		});
	}
}
