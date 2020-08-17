import * as discord from "discord.js";
import { RolDiscord } from "./RolDiscord";

export class ClienteDiscord {
	private readonly cliente: discord.GuildMember;

	public constructor(cliente: discord.GuildMember) { this.cliente = cliente; }

	public ObtenerIdServidor(): string {
		return this.cliente.guild.id;
	}

	public TieneId(id: string): boolean {
        return this.cliente.id === id;
    }

	public EsMismosCliente(cliente: ClienteDiscord): boolean {
		return cliente.TieneId(this.cliente.id);
	}
	
	public AgregarRol(rol: RolDiscord) {
		this.cliente.roles.add(rol.Obtener())
	}

	public RemoverRol(rol: RolDiscord) {
		this.cliente.roles.remove(rol.Obtener())
	}
}