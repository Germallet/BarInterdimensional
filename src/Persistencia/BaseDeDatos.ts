import * as Prisma from '@prisma/client';

export class BaseDeDatos {
	private prisma: Prisma.PrismaClient = new Prisma.PrismaClient();

	public async ObtenerConfiguración(): Promise<Prisma.configuracion[]> {
		const tablaConfiguración: Prisma.configuracionDelegate = this.prisma.configuracion;
		return tablaConfiguración.findMany();
	}

	public async ObtenerMundos(): Promise<Prisma.mundo[]> {
		const tablaMundo: Prisma.mundoDelegate = this.prisma.mundo;
		return tablaMundo.findMany();
	}
	public async GuardarMundo(idMundo: number, datos: Prisma.mundoUpdateInput): Promise<void> {
		const tablaMundo: Prisma.mundoDelegate = this.prisma.mundo;
		await tablaMundo.update({ where: { id: idMundo }, data: datos });
	}

	public async ObtenerNodos(idMundo: number): Promise<Prisma.nodo[]> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		return tablaNodo.findMany({ where: { mundo: idMundo } });
	}
	public async GuardarNodo(idNodo: number, datos: Prisma.nodoUpdateInput): Promise<void> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		await tablaNodo.update({ where: { id: idNodo }, data: datos });
	}
}
