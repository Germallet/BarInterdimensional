import { ServidorDiscord } from "./DiscordAPI/ServidorDiscord";
import { Mundo } from "./Mundo";
import { GrupoDePermisosDiscord, CanalDiscord } from "./DiscordAPI/CanalDiscord";
import { CategoríaDiscord } from "./DiscordAPI/CategoríaDiscord";
import { CanalDeVozDiscord } from "./DiscordAPI/CanalDeVozDiscord";
import { CanalDeTextoDiscord } from "./DiscordAPI/CanalDeTextoDiscord";
import { RolDiscord } from "./DiscordAPI/RolDiscord";

export class Nodo {
    private readonly nombre: string;
    private readonly mundo: Mundo;
    private canalVoz: CanalDeVozDiscord;
    private canalTexto: CanalDeTextoDiscord;
    private rol: RolDiscord;
    private readonly adyacentes: Array<Nodo> = new Array<Nodo>();
    
    public constructor(nombre: string, mundo: Mundo) { 
        this.nombre = nombre;
        this.mundo = mundo;
    }

    public async Generar(servidor: ServidorDiscord, categoría: CategoríaDiscord) {
        await this.CrearCanales(servidor, categoría);
        await this.CrearRol(servidor);
    }

    private async CrearCanales(servidor: ServidorDiscord, categoría: CategoríaDiscord) {
        this.canalTexto = await servidor.CrearCanalDeTexto(this.nombre, categoría);
        this.canalVoz = await servidor.CrearCanalDeVoz(this.nombre, categoría);
    }
    
    private async CrearRol(servidor: ServidorDiscord) {
        this.rol = await servidor.CrearRol({
            name: this.nombre,
            color: 'WHITE',
            hoist: false,
            //position?: number;
            permissions: 0,
            mentionable: false
        })

        await this.canalVoz.CambiarPermisos([this.PermisoDeCanalesPropios()]);
        await this.canalTexto.CambiarPermisos([this.PermisoDeCanalesPropios()]);
    }

    public async AgregarAdyacente(adyacente: Nodo) {
        this.adyacentes.push(adyacente);
        await adyacente.EstablecerVisible(this.rol);
    }
    public async EstablecerVisible(rol: RolDiscord) {
        await this.canalVoz.CambiarPermisos([this.PermisoDeCanalesAdyacente(rol)]);
    }      
    
    public TieneCanal(canal: CanalDiscord) { return this.canalVoz.EsMismoCanal(canal) || this.canalTexto.EsMismoCanal(canal); }

    public ObtenerRol(): RolDiscord { return this.rol; }

    public ObtenerAdyacentes(): Array<Nodo> { return this.adyacentes; }

    public ObtenerMundo(): Mundo { return this.mundo; } 

    private PermisoDeCanalesAdyacente(rolAdyacente: RolDiscord): GrupoDePermisosDiscord {
        return rolAdyacente.CrearGrupoDePermisos(
            [
                'VIEW_CHANNEL',
                'CONNECT',
                'SPEAK',
                'USE_VAD'
            ],
            [
                'ADMINISTRATOR',
                'CREATE_INSTANT_INVITE',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'ADD_REACTIONS',
                'VIEW_AUDIT_LOG',
                'PRIORITY_SPEAKER',
                'STREAM',
                'SEND_MESSAGES',
                'SEND_TTS_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'READ_MESSAGE_HISTORY',
                'MENTION_EVERYONE',
                'USE_EXTERNAL_EMOJIS',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS',
                'CHANGE_NICKNAME',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS',
                'MANAGE_EMOJIS'
            ]
        );
    }

    private PermisoDeCanalesPropios(): GrupoDePermisosDiscord {
        return this.rol.CrearGrupoDePermisos(
            [
                'VIEW_CHANNEL',
                'CONNECT',
                'SPEAK',
                'USE_VAD',
                'SEND_MESSAGES'
            ],
            [
                'ADMINISTRATOR',
                'CREATE_INSTANT_INVITE',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'ADD_REACTIONS',
                'VIEW_AUDIT_LOG',
                'PRIORITY_SPEAKER',
                'STREAM',
                'SEND_TTS_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'READ_MESSAGE_HISTORY',
                'MENTION_EVERYONE',
                'USE_EXTERNAL_EMOJIS',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS',
                'CHANGE_NICKNAME',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS',
                'MANAGE_EMOJIS'
            ]
        );
    }
}