import * as Discord from '#discord-api';
import { Comando } from './Comando';

export class ComandoFinal extends Comando {
	private readonly acción: (parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>) => void;

	public constructor(nombres: Array<string>, acción: (parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>) => void) {
		super(nombres);
		this.acción = acción;
	}

	public async Ejecutar(parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>): Promise<void> {
		return this.acción(parámetros, adjuntos);
	}
}
