import { ServidorDiscord } from "./DiscordAPI/ServidorDiscord";
import { CategoríaDiscord } from "./DiscordAPI/CategoríaDiscord";
import { Nodo } from "./Nodo";
import { Perfil } from "./Perfil";
import { Consola } from "./Consola";
import { Usuario } from "./Usuario";
import { Configuración } from './Configuración';
import { Universo } from "./Universo";
import { CanalDiscord } from "./DiscordAPI/CanalDiscord";

export class Mundo {
    private readonly servidor: ServidorDiscord;
    private nodos: Array<Nodo>;
    private readonly perfiles: Array<Perfil> = new Array<Perfil>();
    private nodoInicial: Nodo;

    public constructor(servidor: ServidorDiscord) { this.servidor = servidor; }

    public EsServidor(id: string) { return this.servidor.TieneId(id) }

    public async Generar(configuración: Configuración) {
        await this.servidor.Limpiar();
        const categoría: CategoríaDiscord = await this.servidor.CrearCategoría('Mundo');
        this.nodos = await configuración.CrearNodos(this, this.servidor, categoría);
        this.nodoInicial = this.nodos[0];
        
        await Promise.all(this.servidor.ObtenerClientes().map(cliente => this.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(cliente))));
        Consola.Normal('[MUNDO]', 'Mundo generado!');
    }

    public async CrearPerfil(usuario: Usuario) {
        const perfil: Perfil = new Perfil(usuario, this);
        this.perfiles.push(perfil);
        usuario.AgregarPerfil(perfil);
        usuario.MoverseA(this.nodoInicial);
    }

    public ObtenerNombre(): string {
        return this.servidor.ObtenerNombre();
    }

    public ObtenerNodo(canal: CanalDiscord) {
        return this.nodos.find(nodo => nodo.TieneCanal(canal));
    }
}