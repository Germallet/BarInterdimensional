import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Usuario, Perfil } from '#usuario';
import { Nodo } from './Nodo';
import { Universo } from './Universo';
import { Presence } from 'discord.js';

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

	public async Generar(mundoPrisma: Prisma.mundo): Promise<void> {
		const categoría: Discord.Categoría = await this.CargarOCrearCategoría(mundoPrisma.categoria);
		const nodosPrisma: Prisma.nodo[] = await Persistencia.BaseDeDatos().ObtenerNodos(this.id);

		const instanciaciones: Array<[Prisma.nodo, Nodo]> = nodosPrisma.map((nodoPrisma) => [nodoPrisma, new Nodo(nodoPrisma.id, nodoPrisma.nombre)]);
		const generaciónDeNodos: Array<[Nodo, Array<Nodo>]> = instanciaciones.map((tupla) => [tupla[1], null]);

		await Promise.all(
			instanciaciones.map((tupla) => {
				tupla[1].Generar(tupla[0], this.servidor, categoría);
			})
		);
		for (const tupla of instanciaciones) {
			const adyacentes: Array<Nodo> = (await Persistencia.BaseDeDatos().ObtenerAdyacentes(tupla[0].id)).map((id) => instanciaciones.find((tupla2) => tupla2[0].id == id)[1]);
			tupla[1].AgregarAdyacentes(adyacentes);
		}

		generaciónDeNodos.forEach((tupla) => this.nodos.push(tupla[0]));
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
