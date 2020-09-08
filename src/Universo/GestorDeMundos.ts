import * as Discord from '#discord-api';
import * as Prisma from '@prisma/client';
import { Persistencia } from '#persistencia';
import { Nodo } from './Nodo';
import { Mundo } from './Mundo';
import { Universo } from './Universo';
import { Consola } from '../Consola';

export class GestorDeMundos {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();

	public async CargarMundos(): Promise<void> {
		const mundosPrisma: Prisma.mundo[] = await Persistencia.BaseDeDatos().ObtenerMundos();
		await Promise.all(mundosPrisma.map((mundoPrisma) => this.CargarMundo(mundoPrisma)));
	}

	public async CargarMundo(mundoPrisma: Prisma.mundo): Promise<void> {
		const mundo: Mundo = new Mundo(mundoPrisma, await Universo.Dios().ObtenerServidor(mundoPrisma.guild));
		mundo.Generar(mundoPrisma);
		this.mundos.push(mundo);
		Consola.Normal('[MUNDOS]', `Mundo cargado (nombre: ${mundo.ObtenerNombre()}, id: ${mundoPrisma.id}, guild: ${mundoPrisma.guild})`);
	}

	public ObtenerMundo(id: string): Mundo {
		return this.mundos.find((mundo) => mundo.EsServidor(id));
	}

	public ObtenerNodo(canal: Discord.CanalDeVoz): Nodo {
		if (canal == null) return null;
		const mundo: Mundo = this.ObtenerMundo(canal.ObtenerIdServidor());
		return mundo != undefined ? mundo.ObtenerNodo(canal) : null;
	}
}
