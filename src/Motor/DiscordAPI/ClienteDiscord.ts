import * as discord from "discord.js";
import { RolDiscord } from "./RolDiscord";
import { CanalDeVozDiscord } from "./CanalDeVozDiscord";

export class ClienteDiscord {
	private readonly cliente: discord.GuildMember;

	public constructor(cliente: discord.GuildMember) { this.cliente = cliente; }

	public ObtenerIdServidor(): string {
		return this.cliente.guild.id;
	}

	public ObtenerCanalDeVoz(): CanalDeVozDiscord {
		return this.cliente.voiceChannel != undefined ? new CanalDeVozDiscord(this.cliente.voiceChannel) : null;
	}

	public TieneId(id: string): boolean {
        return this.cliente.id === id;
    }

	public EsMismosCliente(cliente: ClienteDiscord): boolean {
		return cliente.TieneId(this.cliente.id);
	}
	
	public AgregarRol(rol: RolDiscord) {
		this.cliente.addRole(rol.Obtener())
	}

	public RemoverRol(rol: RolDiscord) {
		this.cliente.removeRole(rol.Obtener())
	}
}