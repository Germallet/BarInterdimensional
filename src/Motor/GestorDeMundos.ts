import * as discord from "discord.js";
import * as BD from "@prisma/client"
import { Mundo } from "./Mundo";
import { Universo } from "./Universo";
import { Consola } from "./Consola";

export class GestorDeMundos {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();

    public async CargarMundos() {
        const listaMundosBD: BD.mundo[] = await Universo.BaseDeDatos().ObtenerMundos();
        await Promise.all(listaMundosBD.map(mundoBD => this.CargarMundo(mundoBD.guild.toString())));
    }

    public async CargarMundo(id: string) {
        const mundo: Mundo = new Mundo(await Universo.Dios().ObtenerGuild(id));
        this.mundos.push(mundo);
        Consola.Normal('[MUNDOS]', `Mundo cargado (id: ${id})`);
    }

    public async CrearMundo(guild: discord.Guild) {
        const mundo: Mundo = new Mundo(guild);
        //await mundo.Generar();
        //await Promise.all(guild.members.map(miembro => mundo.CrearPerfil(Universo.Usuarios().ObtenerOCrearUsuario(miembro))));
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