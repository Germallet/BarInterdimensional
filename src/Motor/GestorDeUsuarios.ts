import { Usuario } from "./Usuario";
import { ClienteDiscord } from "./DiscordAPI/ClienteDiscord";

export class GestorDeUsuarios {
    private readonly usuarios: Array<Usuario> = new Array<Usuario>();
    
    private CrearUsuario(cliente: ClienteDiscord){
		const nuevoUsuario: Usuario = new Usuario(cliente);
		this.usuarios.push(nuevoUsuario);
    }
    
    private TieneUsuario(cliente: ClienteDiscord) {
		return this.usuarios.some(usuario => usuario.EsCliente(cliente));
    }
	
	public ObtenerUsuario(id: string): Usuario {
		return this.usuarios.find(usuario => usuario.TieneId(id))
	}

    public ObtenerOCrearUsuario(cliente: ClienteDiscord): Usuario {
		if(!this.TieneUsuario(cliente))
			this.CrearUsuario(cliente);
		return this.usuarios.find(usuario => usuario.EsCliente(cliente));
	}
}