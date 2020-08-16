import { Usuario } from "./Usuario";
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

    public async MoverseA(nodo: Nodo) {

        const release = await this.mutex.acquire();
        
        if(this.ultimoNodo !== nodo)
        {
            await this.CambiarRoles(nodo);
            this.ultimoNodo = nodo;
        }
        
        release();
    }

    private async CambiarRoles(nodo: Nodo) {
        
        const promesas = new Array<Promise<void>>();

        if(this.ultimoNodo != null)
            promesas.push(this.usuario.RemoverRol(this.ultimoNodo.ObtenerRol()));
        if(nodo != null)
            promesas.push(this.usuario.AgregarRol(nodo.ObtenerRol())); 
                
        return Promise.all(promesas);
    }
}