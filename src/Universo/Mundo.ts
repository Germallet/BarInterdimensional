import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Usuario, Perfil } from '#usuario';
import { Nodo } from './Nodo';
import { Universo } from './Universo';
import { Consola } from '../Consola';

export class Mundo {
	private readonly id: number;
	private readonly servidor: Discord.Servidor;
	private readonly nodos: Array<Nodo> = new Array<Nodo>();
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();
	private nodoInicial: Nodo;

	public constructor(mundoPrisma: Prisma.mundo, servidor: Discord.Servidor) {
		this.id = mundoPrisma.id;
		this.servidor = servidor;
	}

	public EsServidor(id: string): boolean {
		return this.servidor.TieneId(id);
	}

	private async CargarOCrearCategoría(idCategoría: string): Promise<Discord.Categoría> {
		try {
			return this.servidor.ObtenerCategoría(idCategoría);
		} catch {
			const categoría: Discord.Categoría = await this.servidor.CrearCategoría('Mundo');
			await Persistencia.BaseDeDatos().GuardarMundo(this.id, { categoria: categoría.ObtenerId() });
			return categoría;
		}
	}

	private async CrearNodo(nodoPrisma: Prisma.nodo, categoría: Discord.Categoría) {
		const nodo: Nodo = new Nodo(nodoPrisma.id, nodoPrisma.nombre);
		await nodo.Generar(nodoPrisma, this.servidor, categoría);
		this.nodos.push(nodo);
	}

	public async Generar(mundoPrisma: Prisma.mundo): Promise<void> {
		const categoría: Discord.Categoría = await this.CargarOCrearCategoría(mundoPrisma.categoria);
		const nodosPrisma: Prisma.nodo[] = await Persistencia.BaseDeDatos().ObtenerNodos(this.id);

		await Promise.all(nodosPrisma.map((nodoPrisma) => this.CrearNodo(nodoPrisma, categoría)));

		this.nodoInicial = this.nodos[0];
		await Promise.all(this.servidor.ObtenerClientes().map((cliente) => this.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(cliente))));
	}

	public async CrearPerfil(usuario: Usuario): Promise<void> {
		const perfil: Perfil = new Perfil(usuario, this);
		this.perfiles.push(perfil);
		usuario.AgregarPerfil(perfil);
		return this.nodoInicial.Entrar(usuario);
	}

	public ObtenerNombre(): string {
		return this.servidor.ObtenerNombre();
	}

	public ObtenerNodo(canal: Discord.CanalDeVoz): Nodo {
		return this.nodos.find((nodo) => nodo.TieneCanalDeVoz(canal));
	}
}
