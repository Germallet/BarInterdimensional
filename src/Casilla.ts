import * as discord from "discord.js";

export class Casilla
{
    private nombre : string;
    private rol : discord.Role;
    private canalVoz : discord.Channel;
    private canalTexto : discord.Channel;
    
    public Crear(servidor : discord.Guild)
    {
        servidor.createRole
        ({
            name: this.nombre,
            color: 'WHITE',
            hoist: false,
            //position?: number;
            permissions: this.Permisos(),
            mentionable: false
        });
        
        this.rol = servidor.roles.get(this.nombre);

        servidor.createChannel(this.nombre, { type: 'text' });
        servidor.createChannel(this.nombre, { type: 'voice' });
        
        /*servidor.channels.get(this.nombre).overwritePermissions(this.rol,
        {
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
            VIEW_CHANNEL: false,
            READ_MESSAGES: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            EXTERNAL_EMOJIS: false,
            CONNECT: false,
            SPEAK: false,
            MUTE_MEMBERS: false,
            DEAFEN_MEMBERS: false,
            MOVE_MEMBERS: false,
            USE_VAD: false,
            CHANGE_NICKNAME: false,
            MANAGE_NICKNAMES: false,
            MANAGE_ROLES: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            MANAGE_EMOJIS: false
        });*/
    }

    private Permisos()
    {
        return 0;
    }
}