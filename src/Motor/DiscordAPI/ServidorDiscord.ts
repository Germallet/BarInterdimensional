import * as discord from "discord.js";
import { CategoríaDiscord } from "./CategoríaDiscord";
import { CanalDeVozDiscord } from "./CanalDeVozDiscord";
import { CanalDeTextoDiscord } from "./CanalDeTextoDiscord";
import { CanalDiscord } from "./CanalDiscord";
import { Consola } from "../Consola";

export class ServidorDiscord {
    private readonly servidor: discord.Guild;

    public constructor(guild: discord.Guild) { this.servidor = guild; }
    
    public ObtenerNombre(): string {
        return this.servidor.name;
    }

    public ObtenerMiembros(): discord.GuildMember[] {
        return this.servidor.members.array();
    }

    public TieneId(id: string): boolean {
        return this.servidor.id === id;
    }
    
    private async CrearCanal(nombre: string, tipo: discord.GuildChannelType, creador: (canal: discord.ChannelResolvable) => CanalDiscord) {
        const copiaServidor: discord.Guild = this.servidor;
        return new Promise(function(resolver, rechazar) {
            copiaServidor.createChannel(nombre, { type: tipo }).then(
                function(resultado: discord.ChannelResolvable) {
                    resolver(creador(resultado));
                }, rechazar
            );
        });
    }

    public async CrearCategoría(nombre: string): Promise<CategoríaDiscord> {
        return this.CrearCanal(nombre, 'category', (canal) => new CategoríaDiscord(canal as discord.CategoryChannel)) as Promise<CategoríaDiscord>;
    }

    public async CrearCanalDeTexto(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeTextoDiscord> {
        return this.CrearCanal(nombre, 'text', (canal) => new CanalDeTextoDiscord(canal as discord.TextChannel)) as Promise<CanalDeTextoDiscord>;
    }

    public async CrearCanalDeVoz(nombre: string, categoría: CategoríaDiscord): Promise<CanalDeVozDiscord> {
        return this.CrearCanal(nombre, 'voice', (canal) => new CanalDeVozDiscord(canal as discord.VoiceChannel)) as Promise<CanalDeVozDiscord>;
    }
    
    public async CrearRol(datos: discord.RoleData) {
        return this.servidor.createRole(datos);
    }

    private async BorrarCanales() {
        Promise.all
        (
            this.servidor.channels.map(canal => canal.delete().catch(excepción => Consola.Warning('[SERVIDOR]', `Excepción al borrar canal "${canal.name}" para limpiado de mundo "${this.servidor.name}": "${excepción}"`))
        ));
    }
    
    private async BorrarRoles() {
        Promise.all
        (
            this.servidor.roles.map(rol => {
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