import * as discord from "discord.js";
import { Usuario } from "./Usuario";

export class GestorDeUsuarios {
    private readonly usuarios: Array<Usuario> = new Array<Usuario>();
    
    private CrearUsuario(miembro: discord.GuildMember){
		const nuevoUsuario: Usuario = new Usuario(miembro);
		this.usuarios.push(nuevoUsuario);
    }
    
    private TieneUsuario(miembro: discord.GuildMember) {
		return this.usuarios.some(usuario => usuario.esMiembro(miembro));
    }
    
    public ObtenerOCrearUsuario(miembro: discord.GuildMember): Usuario{
		if(!this.TieneUsuario(miembro))
			this.CrearUsuario(miembro);
		return this.usuarios.find(usuario => usuario.esMiembro(miembro));
	}
}