import * as Discord from "@discord-api";
import { Perfil } from "./Perfil";
import { Mundo } from "./Mundo";
import { Nodo } from "./Nodo";

export class Usuario {
    private readonly cliente: Discord.Cliente;
    private readonly perfiles: Array<Perfil> = new Array<Perfil>();

    public constructor(cliente: Discord.Cliente) { this.cliente = cliente; }
    
    public AgregarPerfil(perfil: Perfil) {
        this.perfiles.push(perfil);
    }
    private ObtenerPerfil(mundo: Mundo): Perfil {
        return this.perfiles.find(perfil => perfil.EsDeMundo(mundo));
    }

    public TieneId(id: string) {
        return this.cliente.TieneId(id);
    }

    public EsCliente(cliente: Discord.Cliente) { return this.cliente.EsMismosCliente(cliente); }

    public async MoverseA(nodo: Nodo) {
        const mundo: Mundo = nodo.ObtenerMundo();
        const perfil: Perfil = this.ObtenerPerfil(mundo);
        perfil.MoverseA(nodo);
    }

    public async AgregarRol(rol: Discord.Rol) { this.cliente.AgregarRol(rol); }
    public async RemoverRol(rol: Discord.Rol) { this.cliente.RemoverRol(rol); }
}