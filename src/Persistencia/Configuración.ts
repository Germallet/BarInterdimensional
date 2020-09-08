import * as Prisma from '@prisma/client';
import { Persistencia } from './Persistencia';

export class Configuración {
	private registros: { [identificador: string]: string | number };

	public async Cargar(): Promise<void> {
		this.LeerRegistros(await Persistencia.BaseDeDatos().ObtenerConfiguración());
	}

	private LeerRegistros(registros: Prisma.configuracion[]): void {
		this.registros = {};
		registros.forEach((registro) => this.CargarRegistro(registro));
	}

	private CargarRegistro(registro: Prisma.configuracion): void {
		if (!registro.numerico) {
			this.registros[registro.identificador] = registro.valor;
		} else {
			const valorNumerico: number = parseInt(registro.valor);
			if (isNaN(valorNumerico)) throw new Error(`El registro numérico "${registro.identificador}" no es válido (valor: "${registro.valor})"`);
			this.registros[registro.identificador] = valorNumerico;
		}
	}

	public Obtener<T extends string | number>(identificador: string): T {
		if (!(identificador in this.registros)) throw new Error('El registro buscado no existe');
		return this.registros[identificador] as T;
	}

	public CantidadDeRegistros(): number {
		return Object.keys(this.registros).length;
	}
}
