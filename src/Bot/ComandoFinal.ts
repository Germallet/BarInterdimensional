import * as Discord from '#discord-api';
import { Comando } from './Comando';

export class ComandoFinal extends Comando {
	private readonly acción: (parámetros: Array<string>, adjuntos: Discord.Mensaje) => void;

	public constructor(nombres: Array<string>, acción: (parámetros: Array<string>, adjuntos: Discord.Mensaje) => void) {
		super(nombres);
		this.acción = acción;
	}

	public async Ejecutar(parámetros: Array<string>, adjuntos: Discord.Mensaje): Promise<void> {
		return this.acción(parámetros, adjuntos);
	}
}
