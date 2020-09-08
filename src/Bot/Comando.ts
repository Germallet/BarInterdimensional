import * as Discord from '#discord-api';

export abstract class Comando {
	protected readonly nombres: Array<string>;

	public constructor(nombres: Array<string>) {
		this.nombres = nombres;
	}

	public EsComando(nombre: string): boolean {
		return this.nombres.includes(nombre);
	}

	public ObtenerNombre(): string {
		return this.nombres[0];
	}

	public abstract async Ejecutar(parámetros: Array<string>, adjuntos: Array<Discord.ContenidoAdjunto>): Promise<void>;
}
