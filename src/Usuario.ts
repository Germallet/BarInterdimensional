import * as discord from "discord.js";
import { Perfil } from "./Perfil";
import { Mundo } from "./Mundo";
import { Nodo } from "./Nodo";

export class Usuario {
    private readonly miembro: discord.GuildMember;
    private readonly perfiles: Array<Perfil> = new Array<Perfil>();

    public constructor(miembro: discord.GuildMember) { this.miembro = miembro; }
    
    public AgregarPerfil(perfil: Perfil) {
        this.perfiles.push(perfil);
    }
    private ObtenerPerfil(mundo: Mundo): Perfil {
        return this.perfiles.find(perfil => perfil.EsDeMundo(mundo));
    }

    public esMiembro(miembro: discord.GuildMember) { return this.miembro.id === miembro.id; }

    public async MoverseA(nodo: Nodo) {
        const mundo: Mundo = nodo.ObtenerMundo();
        const perfil: Perfil = this.ObtenerPerfil(mundo);

        perfil.MoverseA(this.miembro, nodo);
    }
}