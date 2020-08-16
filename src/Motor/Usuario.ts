import { Perfil } from "./Perfil";
import { Mundo } from "./Mundo";
import { Nodo } from "./Nodo";
import { ClienteDiscord } from "./DiscordAPI/ClienteDiscord";
import { RolDiscord } from "./DiscordAPI/RolDiscord";

export class Usuario {
    private readonly cliente: ClienteDiscord;
    private readonly perfiles: Array<Perfil> = new Array<Perfil>();

    public constructor(cliente: ClienteDiscord) { this.cliente = cliente; }
    
    public AgregarPerfil(perfil: Perfil) {
        this.perfiles.push(perfil);
    }
    private ObtenerPerfil(mundo: Mundo): Perfil {
        return this.perfiles.find(perfil => perfil.EsDeMundo(mundo));
    }

    public TieneId(id: string) {
        return this.cliente.TieneId(id);
    }

    public EsCliente(cliente: ClienteDiscord) { return this.cliente.EsMismosCliente(cliente); }

    public async MoverseA(nodo: Nodo) {
        const mundo: Mundo = nodo.ObtenerMundo();
        const perfil: Perfil = this.ObtenerPerfil(mundo);
        perfil.MoverseA(nodo);
    }

    public async AgregarRol(rol: RolDiscord) { this.cliente.AgregarRol(rol); }
    public async RemoverRol(rol: RolDiscord) { this.cliente.RemoverRol(rol); }
}