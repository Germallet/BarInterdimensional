import { PrismaClient, UserDelegate, User } from "@prisma/client"
import { Consola } from './Consola';
 
export class BaseDeDatos {

    private prisma: PrismaClient = new PrismaClient()

    public async main() {
        const tablaUser: UserDelegate = await this.prisma.user;
        const usuario1: User = (await tablaUser.findMany())[1];
        console.log(usuario1.email)
    }
}