import * as discord from 'discord.js';
import { CanalDiscord } from './CanalDiscord';
import { ImagenAdjuntaDiscord } from './ImagenAdjuntaDiscord';

export class CanalDeTextoDiscord extends CanalDiscord<discord.TextChannel> {
	public async EnviarMensajeConImagen(contenido: string, imagen: ImagenAdjuntaDiscord): Promise<void> {
		await this.canal.send(contenido, imagen.Obtener());
	}
}
