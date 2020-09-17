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
	public async CrearMundo(datos: Prisma.mundoCreateInput): Promise<number> {
		const tablaMundo: Prisma.mundoDelegate = this.prisma.mundo;
		return (await tablaMundo.create({ select: { id: true }, data: datos })).id;
	}

	public async ObtenerNodos(idMundo: number): Promise<Prisma.nodo[]> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		return tablaNodo.findMany({ where: { mundo: idMundo } });
	}
	public async CrearNodo(datos: Prisma.nodoCreateInput): Promise<number> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		return (await tablaNodo.create({ select: { id: true }, data: datos })).id;
	}
	public async GuardarNodo(idNodo: number, datos: Prisma.nodoUpdateInput): Promise<void> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		await tablaNodo.update({ where: { id: idNodo }, data: datos });
	}
	public async BorrarNodos(idMundo: number): Promise<void> {
		const tablaNodo: Prisma.nodoDelegate = this.prisma.nodo;
		await tablaNodo.deleteMany({ where: { mundo: idMundo } });
	}

	public async ObtenerAdyacentes(idNodo: number): Promise<number[]> {
		const tablaAdyacencias: Prisma.adyacenciaDelegate = this.prisma.adyacencia;
		return (await tablaAdyacencias.findMany({ where: { origen: idNodo } })).map((adyacencia) => adyacencia.destino);
	}
	public async CrearAdyacencia(datos: Prisma.adyacenciaCreateInput): Promise<void> {
		const tablaAdyacencias: Prisma.adyacenciaDelegate = this.prisma.adyacencia;
		await tablaAdyacencias.create({ data: datos });
	}
	public async BorrarAdyacencias(idNodo: number): Promise<void> {
		const tablaAdyacencias: Prisma.adyacenciaDelegate = this.prisma.adyacencia;
		await tablaAdyacencias.deleteMany({ where: { OR: [{ origen: idNodo }, { destino: idNodo }] } });
	}
}
