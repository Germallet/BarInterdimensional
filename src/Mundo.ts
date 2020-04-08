import * as discord from "discord.js";
import { Casilla } from "./Casilla";
import { Consola } from "./Consola";

export class Mundo {
    private readonly guild: discord.Guild;
    private readonly casillas: Array<Casilla> = new Array<Casilla>();

    public constructor(guild: discord.Guild) {
        this.guild = guild;
    }

    private async Limpiar() {
        this.guild.roles.forEach(async rol =>
            await rol.delete().catch( excepción => Consola.Warning('[MUNDO]', `Excepción al borrar rol "${rol.name}" para limpiado de mundo "${this.guild.name}": "${excepción}"`))
        );
        this.guild.channels.forEach(async canal =>
            await canal.delete().catch( excepción => Consola.Warning('[MUNDO]', `Excepción al borrar canal "${canal.name}" para limpiado de mundo "${this.guild.name}": "${excepción}"`))
        );
    }

    public async Generar() {
        await this.Limpiar();
        const categoría: discord.ChannelResolvable = await this.guild.createChannel('Mundo', { type: 'category' });  // TODO
        this.GenerarCasillas(categoría);
        Consola.Normal('[MUNDO]', 'Mundo generado!');
    }
    private GenerarCasillas(categoría: discord.ChannelResolvable) {
        for (let i = 0; i < 5; i++) this.casillas.push(new Casilla(i.toString()));
        this.casillas.forEach(casilla => this.GenerarCasilla(casilla, categoría));
    }
    private GenerarCasilla(casilla: Casilla, categoría: discord.ChannelResolvable) {
        casilla.CrearCanales(this.guild, categoría);
        casilla.CrearRol(this.guild);
    }
}