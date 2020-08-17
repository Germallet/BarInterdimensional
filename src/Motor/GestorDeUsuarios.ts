import * as Discord from "@discord-api";
import { Usuario } from "./Usuario";

export class GestorDeUsuarios {
    private readonly usuarios: Array<Usuario> = new Array<Usuario>();
    
    private CrearUsuario(cliente: Discord.Cliente){
		const nuevoUsuario: Usuario = new Usuario(cliente);
		this.usuarios.push(nuevoUsuario);
    }
    
    private TieneUsuario(cliente: Discord.Cliente) {
		return this.usuarios.some(usuario => usuario.EsCliente(cliente));
    }
	
	public ObtenerUsuario(id: string): Usuario {
		return this.usuarios.find(usuario => usuario.TieneId(id))
	}

    public ObtenerOCrearUsuario(cliente: Discord.Cliente): Usuario {
		if(!this.TieneUsuario(cliente))
			this.CrearUsuario(cliente);
		return this.usuarios.find(usuario => usuario.EsCliente(cliente));
	}
}