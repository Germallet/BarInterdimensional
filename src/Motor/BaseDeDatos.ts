import * as BD from "@prisma/client"
 
export class BaseDeDatos {

    private prisma: BD.PrismaClient = new BD.PrismaClient()

    public async ObtenerMundos(): Promise<BD.Mundo[]> {
        const tablaMundo: BD.MundoDelegate = this.prisma.mundo;
        return tablaMundo.findMany();
    }
}