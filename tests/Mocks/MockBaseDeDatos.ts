import { BaseDeDatos } from '#persistencia';
import * as Prisma from '@prisma/client';

export class MockBaseDeDatos extends BaseDeDatos {
	private configuración: Prisma.configuracion[] = new Array<Prisma.configuracion>();
	private mundos: Prisma.mundo[] = new Array<Prisma.mundo>();
	private nodos: Prisma.nodo[] = new Array<Prisma.nodo>();

	public async EstablecerConfiguración(configuración: Prisma.configuracion[]) {
		this.configuración = configuración;
	}
	public async ObtenerConfiguración(): Promise<Prisma.configuracion[]> {
		return this.configuración;
	}

	public async EstablecerNodos(nodos: Prisma.nodo[]) {
		this.nodos = nodos;
	}
	public async ObtenerNodos(idMundo: number): Promise<Prisma.nodo[]> {
		return this.nodos.filter((nodo) => nodo.mundo == idMundo);
	}
	public async GuardarNodo(idNodo: number, datos: Prisma.nodoUpdateInput): Promise<void> {
		return this.nodos
			.filter((nodo) => nodo.id == idNodo)
			.forEach((nodo) => {
				if (datos.id) nodo.id = datos.id as number;
				if (datos.nombre) nodo.nombre = datos.nombre as string;
				if (datos.canalvoz) nodo.canalvoz = datos.canalvoz as string;
				if (datos.canaltexto) nodo.canaltexto = datos.canaltexto as string;
				if (datos.mundo_mundoTonodo) nodo.mundo = datos.mundo_mundoTonodo as number;
			});
	}

	public async EstablecerMundos(mundos: Prisma.mundo[]) {
		this.mundos = mundos;
	}
	public async ObtenerMundos(): Promise<Prisma.mundo[]> {
		return this.mundos;
	}
	public async GuardarMundo(idMundo: number, datos: Prisma.mundoUpdateInput): Promise<void> {
		return this.mundos
			.filter((mundo) => mundo.id == idMundo)
			.forEach((mundo) => {
				if (datos.id) mundo.id = datos.id as number;
				if (datos.guild) mundo.guild = datos.guild as string;
				if (datos.categoria) mundo.categoria = datos.categoria as string;
			});
	}
}
