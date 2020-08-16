import { ServidorDiscord } from "./DiscordAPI/ServidorDiscord";
import { Mundo } from "./Mundo";
import { PermisosDeCanal, CanalDiscord } from "./DiscordAPI/CanalDiscord";
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

        await this.canalVoz.CambiarPermisos(this.rol, this.PermisoDeCanalesPropios());
        await this.canalTexto.CambiarPermisos(this.rol, this.PermisoDeCanalesPropios());
    }

    public async AgregarAdyacente(adyacente: Nodo) {
        this.adyacentes.push(adyacente);
        await adyacente.EstablecerVisible(this.rol);
    }
    public async EstablecerVisible(rol: RolDiscord) {
        await this.canalVoz.CambiarPermisos(rol, this.PermisoDeCanalesAdyacente());
    }      
    
    public TieneCanal(canal: CanalDiscord) { return this.canalVoz.EsMismoCanal(canal) || this.canalTexto.EsMismoCanal(canal); }

    public ObtenerRol(): RolDiscord { return this.rol; }

    public ObtenerAdyacentes(): Array<Nodo> { return this.adyacentes; }

    public ObtenerMundo(): Mundo { return this.mundo; } 

    private PermisoDeCanalesAdyacente(): PermisosDeCanal {
        return {
            ADMINISTRATOR: false,
            CREATE_INSTANT_INVITE: false,
            KICK_MEMBERS: false,
            BAN_MEMBERS: false,
            MANAGE_CHANNELS: false,
            MANAGE_GUILD: false,
            ADD_REACTIONS: false,
            VIEW_AUDIT_LOG: false,
            PRIORITY_SPEAKER: false,
            STREAM: false,
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            EXTERNAL_EMOJIS: false,
            CONNECT: true,
            SPEAK: true,
            MUTE_MEMBERS: false,
            DEAFEN_MEMBERS: false,
            MOVE_MEMBERS: false,
            USE_VAD: true,
            CHANGE_NICKNAME: false,
            MANAGE_NICKNAMES: false,
            MANAGE_ROLES: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            MANAGE_EMOJIS: false
        };
    }

    private PermisoDeCanalesPropios(): PermisosDeCanal {
        return {
            ADMINISTRATOR: false,
            CREATE_INSTANT_INVITE: false,
            KICK_MEMBERS: false,
            BAN_MEMBERS: false,
            MANAGE_CHANNELS: false,
            MANAGE_GUILD: false,
            ADD_REACTIONS: false,
            VIEW_AUDIT_LOG: false,
            PRIORITY_SPEAKER: false,
            STREAM: false,
            VIEW_CHANNEL: true,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            EXTERNAL_EMOJIS: false,
            CONNECT: true,
            SPEAK: true,
            MUTE_MEMBERS: false,
            DEAFEN_MEMBERS: false,
            MOVE_MEMBERS: false,
            USE_VAD: true,
            CHANGE_NICKNAME: false,
            MANAGE_NICKNAMES: false,
            MANAGE_ROLES: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            MANAGE_EMOJIS: false
        };
    }
}