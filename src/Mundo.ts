import * as discord from "discord.js";
import { Casilla } from "./Casilla";
import { Consola } from "./Consola";

export class Mundo {
    private readonly guild: discord.Guild;
    private readonly casillas: Array<Casilla> = new Array<Casilla>();

    public constructor(guild: discord.Guild) { this.guild = guild; }

    public EsGuild(guild: discord.Guild) { return this.guild.id === guild.id; }

    private async Limpiar() {
        await Promise.all
            (
                this.guild.roles.map(rol => rol.delete().catch(excepción => Consola.Warning('[MUNDO]', `Excepción al borrar rol "${rol.name}" para limpiado de mundo "${this.guild.name}": "${excepción}"`)))
            );
        await Promise.all
            (
                this.guild.channels.map(canal => canal.delete().catch(excepción => Consola.Warning('[MUNDO]', `Excepción al borrar canal "${canal.name}" para limpiado de mundo "${this.guild.name}": "${excepción}"`)))
            );
    }

    public async Generar() {
        await this.Limpiar();
        const categoría: discord.ChannelResolvable = await this.guild.createChannel('Mundo', { type: 'category' });  // TODO
        await this.GenerarCasillas(categoría);
        Consola.Normal('[MUNDO]', 'Mundo generado!');
    }
    private async GenerarCasillas(categoría: discord.ChannelResolvable) {
        for (let i = 0; i < 5; i++) this.casillas.push(new Casilla(i.toString()));
        await Promise.all(this.casillas.map(casilla => casilla.Generar(this.guild, categoría)));

        this.HacerAdyacentes(this.casillas[0], this.casillas[1]);
        this.HacerAdyacentes(this.casillas[1], this.casillas[2]);
        this.HacerAdyacentes(this.casillas[2], this.casillas[3]);
        this.HacerAdyacentes(this.casillas[3], this.casillas[4]);
    }
    private HacerAdyacentes(casilla1: Casilla, casilla2: Casilla) {
        casilla1.AgregarAdyacente(casilla2);
        casilla2.AgregarAdyacente(casilla1);
    }

    public Desconexión(cliente: discord.GuildMember) {
        Consola.Normal('[DISCORD]', `Se ha conectado el usuario ${cliente.nickname} a ${cliente.voiceChannel.name}`);
    }
    public Conexión(cliente: discord.GuildMember) {
        Consola.Normal('[DISCORD]', `Se ha desnectado el usuario ${cliente.nickname} de ${cliente.voiceChannel.name}`);
    }
    public async TransladoDeCanal(usuario: discord.GuildMember, canalViejo: discord.VoiceChannel, canalNuevo: discord.VoiceChannel) {
        this.ObtenerCasilaConCanal(canalViejo)?.DesonectarUsuario(usuario);
        /*Consola.Normal('asd', 'Empezando');
        await new Promise( resolve => setTimeout(resolve, 3000) );
        Consola.Normal('asd', 'Terminando');*/
        this.ObtenerCasilaConCanal(canalNuevo)?.ConectarUsuario(usuario);
    }

    private ObtenerCasilaConCanal(canal: discord.Channel) {
        return this.casillas.find(casilla => casilla.TieneCanal(canal));
    }
}