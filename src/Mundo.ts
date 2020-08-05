import * as discord from "discord.js";
import { Nodo } from "./Nodo";
import { Consola } from "./Consola";
import { Configuración } from './Configuración';

export class Mundo {
    private readonly guild: discord.Guild;
    private nodos: Array<Nodo>;

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

        const configuración = new Configuración('../res/servidor.xml');

        const categoría: discord.ChannelResolvable = await this.guild.createChannel('Mundo', { type: 'category' });
        this.nodos = await configuración.CrearNodos(this.guild, categoría);

        Consola.Normal('[MUNDO]', 'Mundo generado!');
    }

    public Desconexión(cliente: discord.GuildMember) {
        Consola.Normal('[DISCORD]', `Se ha conectado el usuario ${cliente.nickname} a ${cliente.voiceChannel.name}`);
    }
    public Conexión(cliente: discord.GuildMember) {
        Consola.Normal('[DISCORD]', `Se ha desnectado el usuario ${cliente.nickname} de ${cliente.voiceChannel.name}`);
    }

    public async TransladoDeCanal(usuario: discord.GuildMember, canalViejo: discord.VoiceChannel, canalNuevo: discord.VoiceChannel) {
        if (this.ObtenerNodoConCanal(canalNuevo) != null) {
            await this.ObtenerNodoConCanal(canalViejo)?.DesonectarUsuario(usuario);
            await this.ObtenerNodoConCanal(canalNuevo)?.ConectarUsuario(usuario);
        }
    }

    private ObtenerNodoConCanal(canal: discord.Channel) {
        return this.nodos.find(nodo => nodo.TieneCanal(canal));
    }
}