import * as Discord from '#discord-api';
import { Comando } from './Comando';

export class ComandoIntermedio extends Comando {
	private readonly comandos: Array<Comando> = new Array<Comando>();
	private readonly acción: (siguienteComando: Comando, parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>) => void;

	public constructor(nombres: Array<string>, acción: (siguienteComando: Comando, parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>) => void) {
		super(nombres);
		this.acción =
			acción != null
				? acción
				: function acción(siguienteComando: Comando, parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>) {
						siguienteComando.Ejecutar(parámetros, adjuntos);
				  };
	}

	public async Ejecutar(parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>): Promise<void> {
		let nombreSiguienteComando: string;
		do {
			if (parámetros.length == 0) throw new Error(`El comando "${this.nombres[0]}" no recibe ningún parámetro.`);
			nombreSiguienteComando = parámetros.shift();
		} while (nombreSiguienteComando == '');

		const siguienteComando = this.ObtenerComando(nombreSiguienteComando);
		if (siguienteComando == null) throw new Error(`El comando "${this.nombres[0]}" no entiende "${nombreSiguienteComando}".`);
		this.acción(siguienteComando, parámetros, adjuntos);
	}

	private ObtenerComando(nombreComando: string): Comando {
		const comandoBuscado: Comando = this.comandos.find((comando) => comando.EsComando(nombreComando));
		return comandoBuscado != undefined ? comandoBuscado : null;
	}

	public AgregarComando(comando: Comando): void {
		this.comandos.push(comando);
	}

	public QuitarComando(comando: Comando): void {
		this.comandos.filter((comandoABorrar) => comandoABorrar != comando);
	}
}
