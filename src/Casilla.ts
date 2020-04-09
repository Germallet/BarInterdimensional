import * as discord from "discord.js";

export class Casilla {
    private nombre: string;
    private rol: discord.Role;
    private canalVoz: discord.VoiceChannel;
    private canalTexto: discord.TextChannel;
    private adyacentes: Array<Casilla> = new Array<Casilla>();

    public constructor(nombre: string) { this.nombre = nombre; }

    public async Generar(servidor: discord.Guild, categoría: discord.ChannelResolvable) {
        await this.CrearCanales(servidor, categoría);
        await this.CrearRol(servidor);
    }
    private async CrearCanales(servidor: discord.Guild, categoría: discord.ChannelResolvable) {
        this.canalTexto = await servidor.createChannel(this.nombre, { type: 'text', parent: categoría }) as discord.TextChannel; // TODO
        this.canalVoz = await servidor.createChannel(this.nombre, { type: 'voice', parent: categoría }) as discord.VoiceChannel; // TODO
    }
    private async CrearRol(servidor: discord.Guild) {
        this.rol = await servidor.createRole({
            name: this.nombre,
            color: 'WHITE',
            hoist: false,
            //position?: number;
            permissions: 0,
            mentionable: false
        });  // TODO

        await this.canalVoz.overwritePermissions(this.rol, this.PermisoDeCanalesEnCasilla());
        await this.canalTexto.overwritePermissions(this.rol, this.PermisoDeCanalesEnCasilla());
    }

    public AgregarAdyacente(adyacente: Casilla) {
        this.adyacentes.push(adyacente);
        adyacente.EstablecerVisible(this.rol);
    }
    public EstablecerVisible(rol: discord.Role) {
        this.canalVoz.overwritePermissions(rol, this.PermisoDeCanalesAdyacente());
    }

    public TieneCanal(canal: discord.Channel) { return canal?.id === this.canalVoz.id || canal?.id === this.canalTexto.id }

    public ConectarUsuario(usuario: discord.GuildMember) {
        usuario.addRole(this.rol);
    }
    public DesonectarUsuario(usuario: discord.GuildMember) {
        usuario.removeRole(this.rol);
    }

    private PermisoDeCanalesAdyacente(): discord.PermissionOverwriteOptions {
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
        }
    }

    private PermisoDeCanalesEnCasilla(): discord.PermissionOverwriteOptions {
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
        }
    }
}