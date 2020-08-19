import * as Discord from '../DiscordAPI/index';
import { Nodo } from './Nodo';
import { Perfil } from './Perfil';
import { Consola } from './Consola';
import { Usuario } from './Usuario';
import { Configuración } from './Configuración';
import { Universo } from './Universo';

export class Mundo {
	private readonly servidor: Discord.Servidor;
	private nodos: Array<Nodo>;
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();
	private nodoInicial: Nodo;

	public constructor(servidor: Discord.Servidor) {
		this.servidor = servidor;
	}

	public EsServidor(id: string): boolean {
		return this.servidor.TieneId(id);
	}

	public async Generar(configuración: Configuración): Promise<void> {
		await this.servidor.Limpiar();
		const categoría: Discord.Categoría = await this.servidor.CrearCategoría('Mundo');
		this.nodos = await configuración.CrearNodos(this, this.servidor, categoría);
		this.nodoInicial = this.nodos[0];

		await Promise.all(this.servidor.ObtenerClientes().map((cliente) => this.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(cliente))));
		Consola.Normal('[MUNDO]', 'Mundo generado!');
	}

	public async CrearPerfil(usuario: Usuario): Promise<void> {
		const perfil: Perfil = new Perfil(usuario, this);
		this.perfiles.push(perfil);
		usuario.AgregarPerfil(perfil);
		return this.nodoInicial.EstablecerInicial(usuario);
	}

	public ObtenerNombre(): string {
		return this.servidor.ObtenerNombre();
	}

	public ObtenerNodo(canal: Discord.Canal): Nodo {
		return this.nodos.find((nodo) => nodo.TieneCanal(canal));
	}
}
