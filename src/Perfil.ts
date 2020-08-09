import { Usuario } from "./Usuario";
import * as discord from "discord.js";
import { Mutex } from 'async-mutex';
import { Mundo } from "./Mundo";
import { Nodo } from "./Nodo";

export class Perfil {
    private readonly usuario: Usuario;
    private readonly mundo: Mundo;
    private ultimoNodo: Nodo;
    private readonly mutex: Mutex = new Mutex();

    public constructor(usuario: Usuario, mundo: Mundo) {
        this.usuario = usuario;
        this.mundo = mundo;
    }

    public EsDeMundo(mundo: Mundo): boolean { return this.mundo === mundo; }

    public async MoverseA(miembro: discord.GuildMember, nodo: Nodo) {

        const release = await this.mutex.acquire();
        
        if(this.ultimoNodo !== nodo)
        {
            await this.CambiarRoles(miembro, nodo);
            this.ultimoNodo = nodo;
        }
        
        release();
    }

    private async CambiarRoles(miembro: discord.GuildMember, nodo: Nodo) {
        
        const promesas = new Array<Promise<discord.GuildMember>>();

        if(this.ultimoNodo != null)
            promesas.push(miembro.removeRole(this.ultimoNodo.ObtenerRol()));
        if(nodo != null)
            promesas.push(miembro.addRole(nodo.ObtenerRol()));
                
        return Promise.all(promesas);
    }
}