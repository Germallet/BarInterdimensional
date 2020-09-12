import * as Discord from '#discord-api';
import { Comando } from './Comando';
import { ComandoIntermedio } from './ComandoIntermedio';

export class GestorDeComandos {
	private readonly comandoRaíz: ComandoIntermedio = new ComandoIntermedio([], null);
	private readonly prefijoComando: string;

	public constructor(prefijoComando: string) {
		this.prefijoComando = prefijoComando;
	}

	public async LeerComando(mensaje: string, adjuntos: Discord.Mensaje): Promise<void> {
		if (!mensaje.startsWith(this.prefijoComando)) return;
		const parámetros: Array<string> = mensaje.substring(this.prefijoComando.length, mensaje.length).split(' '); //trimLeft().split(' ');
		return this.comandoRaíz.Ejecutar(parámetros, adjuntos);
	}

	public AgregarComando(comando: Comando): void {
		this.comandoRaíz.AgregarComando(comando);
	}

	public QuitarComando(comando: Comando): void {
		this.comandoRaíz.QuitarComando(comando);
	}
}
