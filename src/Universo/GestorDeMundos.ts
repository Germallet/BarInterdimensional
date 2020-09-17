import { Diccionario } from '#utilidades';
import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Nodo } from './Nodo';
import { Mundo } from './Mundo';
import { Universo } from './Universo';

export class GestorDeMundos {
	private readonly mundos: Diccionario<string, Mundo> = new Diccionario();

	public async CargarMundos(): Promise<void> {
		const mundosPrisma: Prisma.mundo[] = await Persistencia.BaseDeDatos().ObtenerMundos();
		await Promise.all(mundosPrisma.map((mundoPrisma) => this.CargarMundoDeBD(mundoPrisma)));
	}

	public async CrearMundo(id: number, guild: string): Promise<Mundo> {
		const mundo: Mundo = new Mundo(id, await Universo.Dios().ObtenerServidor(guild));
		mundo.CargarOCrearCategoría(null);
		this.mundos.set(guild, mundo);
		return mundo;
	}
	public async CargarMundoDeBD(mundoPrisma: Prisma.mundo): Promise<Mundo> {
		const mundo: Mundo = new Mundo(mundoPrisma.id, await Universo.Dios().ObtenerServidor(mundoPrisma.guild));
		mundo.GenerarDeBD(mundoPrisma);
		this.mundos.set(mundoPrisma.guild, mundo);
		return mundo;
	}

	public ObtenerMundo(id: string): Mundo {
		return this.mundos.get(id);
	}

	public ObtenerNodo(canal: Discord.CanalDeVoz): Nodo {
		if (canal == null) return null;
		const mundo: Mundo = this.ObtenerMundo(canal.ObtenerIdServidor());
		return mundo != undefined ? mundo.ObtenerNodo(canal) : null;
	}
}
