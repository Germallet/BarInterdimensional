// Ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md

export abstract class Consola {
	private static activa = true;

	public Desactivar(): void {
		Consola.activa = false;
	}

	private static ObtenerTiempo() {
		const date = new Date();
		return `[${new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().replace(/T/, ' ').replace(/\..+/, '')}]`;
	}
	private static LogConFormato(modulo: string, mensaje: string): void {
		try {
			console.log(`\x1b[90m${this.ObtenerTiempo()}\x1b[0m \x1b[96m${modulo} ${mensaje}\x1b[0m`);
		} catch (excepción) {
			this.LogExcepción(excepción);
		}
	}
	private static LogExcepción(excepción: string): void {
		if (Consola.activa) console.log(`[CONSOLA] [ERROR] No se pudo imprimir un mensaje en la consola: ${excepción}`);
	}

	public static Normal(modulo: string, mensaje: string): void {
		if (!Consola.activa) return;
		try {
			const texto = `\x1b[0m${mensaje}`;
			this.LogConFormato(modulo, texto);
		} catch (excepción) {
			this.LogExcepción(excepción);
		}
	}
	public static Warning(modulo: string, mensaje: string): void {
		if (!Consola.activa) return;
		try {
			const texto = `\x1b[33m${mensaje}`;
			this.LogConFormato(modulo, texto);
		} catch (excepción) {
			this.LogExcepción(excepción);
		}
	}
	public static Error(modulo: string, mensaje: string): void {
		if (!Consola.activa) return;
		try {
			const texto = `\x1b[31m${mensaje}`;
			this.LogConFormato(modulo, texto);
		} catch (excepción) {
			this.LogExcepción(excepción);
		}
	}
}
