import * as discord from 'discord.js';
import { CanalDiscord } from './CanalDiscord';
import { ImagenAdjuntaDiscord } from './ImagenAdjuntaDiscord';

export class CanalDeTextoDiscord extends CanalDiscord<discord.TextChannel> {

    public EnviarMensajeConImagen(contenido: string, imagen: ImagenAdjuntaDiscord) {
        this.canal.send(contenido, imagen.Obtener());
    }
}
