import * as BD from '@prisma/client';
import { Persistencia } from './Persistencia';

export class Configuración {
	private registros: { [identificador: string]: string | number };

	public async Cargar(): Promise<void> {
		this.LeerRegistros(await Persistencia.BaseDeDatos().ObtenerConfiguración());
	}

	private LeerRegistros(registros: BD.configuracion[]): void {
		this.registros = {};
		registros.forEach((registro) => this.CargarRegistro(registro));
	}

	private CargarRegistro(registro: BD.configuracion): void {
		if (!registro.numerico) {
			this.registros[registro.identificador] = registro.valor;
		} else {
			const valorNumerico: number = parseInt(registro.valor);
			if (isNaN(valorNumerico)) throw new Error(`El registro numérico "${registro.identificador}" no es válido (valor: "${registro.valor})"`);
			this.registros[registro.identificador] = parseInt(registro.valor);
		}
	}

	public Obtener<T extends string | number>(identificador: string): T {
		if (!(identificador in this.registros)) throw new Error('El registro buscado no existe');
		const valorObtenido: T = this.registros[identificador] as T;
		return valorObtenido;
	}

	public CantidadDeRegistros(): number {
		return Object.keys(this.registros).length;
	}
}
