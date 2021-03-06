import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Usuario, Perfil } from '#usuario';
import { Nodo } from './Nodo';
import { Universo } from './Universo';

export class Mundo {
	private readonly id: number;
	private readonly servidor: Discord.Servidor;
	private categoría: Discord.Categoría;
	private readonly nodos: Array<Nodo> = new Array<Nodo>();
	private readonly perfiles: Array<Perfil> = new Array<Perfil>();
	private nodoInicial: Nodo;

	public constructor(id: number, servidor: Discord.Servidor) {
		this.id = id;
		this.servidor = servidor;
	}

	public async CargarOCrearCategoría(idCategoría: string): Promise<void> {
		try {
			this.categoría = this.servidor.ObtenerCategoría(idCategoría);
		} catch {
			this.categoría = await this.servidor.CrearCategoría('Mundo');
			await Persistencia.BaseDeDatos().GuardarMundo(this.id, { categoria: this.categoría.ObtenerId() });
		}
	}

	public async GenerarDeBD(mundoPrisma: Prisma.mundo): Promise<void> {
		await this.CargarOCrearCategoría(mundoPrisma.categoria);
		const nodosPrisma: Prisma.nodo[] = await Persistencia.BaseDeDatos().ObtenerNodos(this.id);

		const instanciaciones: Array<[Prisma.nodo, Nodo]> = nodosPrisma.map((nodoPrisma) => [nodoPrisma, new Nodo(nodoPrisma.id, nodoPrisma.nombre)]);
		const generaciónDeNodos: Array<[Nodo, Array<Nodo>]> = instanciaciones.map((tupla) => [tupla[1], null]);

		for (const tupla of instanciaciones) {
			await tupla[1].Generar(tupla[0], this.servidor, this.categoría);
		}
		for (const tupla of instanciaciones) {
			const adyacentes: Array<Nodo> = (await Persistencia.BaseDeDatos().ObtenerAdyacentes(tupla[0].id)).map((id) => instanciaciones.find((tupla2) => tupla2[0].id == id)[1]);
			await tupla[1].AgregarAdyacentes(adyacentes);
		}

		generaciónDeNodos.forEach((tupla) => this.nodos.push(tupla[0]));
		this.EstablecerNodoInicial(this.nodos[0]);
		await this.GenerarPerfiles();
	}
	public EstablecerNodoInicial(nodoInicial: Nodo): void {
		this.nodoInicial = nodoInicial;
	}
	public async GenerarPerfiles(): Promise<void> {
		await Promise.all(this.servidor.ObtenerClientes().map((cliente) => this.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(cliente))));
	}

	public async CrearPerfil(usuario: Usuario): Promise<void> {
		const perfil: Perfil = new Perfil(usuario, this);
		this.perfiles.push(perfil);
		usuario.AgregarPerfil(perfil);
		return this.nodoInicial.Entrar(usuario);
	}

	public ObtenerNodo(canal: Discord.CanalDeVoz): Nodo {
		return this.nodos.find((nodo) => nodo.TieneCanalDeVoz(canal));
	}
	public async BorrarNodos(): Promise<void> {
		await Promise.all(this.nodos.map((nodo) => nodo.Borrar()));
		this.nodos.splice(0, this.nodos.length);
		await Persistencia.BaseDeDatos().BorrarNodos(this.id);
	}

	public async CrearNodo(nombre: string): Promise<{ id: number; nodo: Nodo }> {
		const idNodo: number = await Persistencia.BaseDeDatos().CrearNodo({ nombre: nombre, mundo_mundoTonodo: { connect: { id: this.id } } });
		const nuevoNodo: Nodo = new Nodo(idNodo, nombre);
		this.nodos.push(nuevoNodo);
		await nuevoNodo.Generar({ id: idNodo, mundo: this.id, nombre: nombre, canalvoz: null, canaltexto: null }, this.servidor, this.categoría);
		return { id: idNodo, nodo: nuevoNodo };
	}
}
