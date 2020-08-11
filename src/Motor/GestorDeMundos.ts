import * as discord from "discord.js";
import { Mundo } from "./Mundo";
import { Universo } from "./Universo";

export class GestorDeMundos {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();

    public async CrearMundo(guild: discord.Guild) {
        const mundo: Mundo = new Mundo(guild);
        await mundo.Generar();
        await Promise.all(guild.members.map(miembro => mundo.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(miembro))));
        this.mundos.push(mundo);
    }

    public ObtenerMundo(guild: discord.Guild) {
        return this.mundos.find(mundo => mundo.EsGuild(guild));
    }

    public ObtenerNodo(canal: discord.VoiceChannel) {
        if(canal==undefined)
            return null;
        const mundo: Mundo = this.ObtenerMundo(canal.guild);
        return mundo != undefined ? mundo.ObtenerNodo(canal) : null;
    }
}