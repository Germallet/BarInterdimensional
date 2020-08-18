import * as BD from '@prisma/client';

export class BaseDeDatos {
	private prisma: BD.PrismaClient = new BD.PrismaClient();

	public async ObtenerMundos(): Promise<BD.mundo[]> {
		const tablaMundo: BD.mundoDelegate = this.prisma.mundo;
		return tablaMundo.findMany();
	}
}
