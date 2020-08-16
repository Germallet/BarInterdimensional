import * as discord from "discord.js";
import { CategoríaDiscord } from "./CategoríaDiscord";
import { CanalDeVozDiscord } from "./CanalDeVozDiscord";
import { CanalDeTextoDiscord } from "./CanalDeTextoDiscord";
import { CanalDiscord } from "./CanalDiscord";
import { RolDiscord } from "./RolDiscord";
import { Consola } from "../Consola";
import { ClienteDiscord } from "./ClienteDiscord";

export class ServidorDiscord {
    private readonly servidor: discord.Guild;

    public constructor(guild: discord.Guild) { this.servidor = guild; }
    
    public ObtenerNombre(): string {
        return this.servidor.name;
    }

    public ObtenerClientes(): ClienteDiscord[] {
        return this.servidor.members.cache.array().map(guildmember => new ClienteDiscord(guildmember));
    }

    public TieneId(id: string): boolean {
        return this.servidor.id === id;
    }
    
    private async CrearCanal(nombre: string, opciones: discord.GuildCreateChannelOptions, creador: (canal: discord.ChannelResolvable) => CanalDiscord) {
        const copiaServidor: discord.Guild = this.servidor;
        return new Promise(function(resolver, rechazar) {
            copiaServidor.channels.create(nombre, opciones).then(
                function(resultado: discord.ChannelResolvable) {
                    resolver(creador(resultado));
                }, rechazar
            );
        });
    }

    public async CrearCategoría(nombre: string): Promise<CategoríaDiscord> {
        return this.CrearCanal(nombre, { type: 'category' }, (canal) => new CategoríaDiscord(canal as discord.CategoryChannel)) as Promise<CategoríaDiscord>;
    }

    public async CrearCanalDeTexto(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeTextoDiscord> {
        return this.CrearCanal(nombre, { type: 'text', parent: categoría.Obtener() }, (canal) => new CanalDeTextoDiscord(canal as discord.TextChannel)) as Promise<CanalDeTextoDiscord>;
    }

    public async CrearCanalDeVoz(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeVozDiscord> {
        return this.CrearCanal(nombre, { type: 'voice', parent: categoría.Obtener() }, (canal) => new CanalDeVozDiscord(canal as discord.VoiceChannel)) as Promise<CanalDeVozDiscord>;
    }
    
    public async CrearRol(datos: discord.RoleData): Promise<RolDiscord> {
        const copiaServidor: discord.Guild = this.servidor;
        return new Promise(function(resolver, rechazar) {
            copiaServidor.roles.create({ data: datos }).then(
                function(resultado: discord.Role) {
                    resolver(new RolDiscord(resultado));
                }, rechazar
            );
        });
    }

    private async BorrarCanales() {
        Promise.all
        (
            this.servidor.channels.cache.map(canal => canal.delete().catch(excepción => Consola.Warning('[SERVIDOR]', `Excepción al borrar canal "${canal.name}" para limpiado de mundo "${this.servidor.name}": "${excepción}"`))
        ));
    }
    
    private async BorrarRoles() {
        Promise.all
        (
            this.servidor.roles.cache.map(rol => {
                if (rol.name != "@everyone" && rol.name != "Dios")
                    rol.delete().catch(excepción => Consola.Warning('[SERVIDOR]', `Excepción al borrar rol "${rol.name}" para limpiado de mundo "${this.servidor.name}": "${excepción}"`));
            }
        ));
    }
    
    public async Limpiar() {
        this.BorrarCanales();
        this.BorrarRoles();
    }
}