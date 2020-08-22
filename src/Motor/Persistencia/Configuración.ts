import * as BD from '@prisma/client';
import { Persistencia } from './Persistencia';
import { Consola } from 'Motor/Consola';

export class Configuración {
	private registros: { [identificador: string]: string | number };

	public async Cargar(): Promise<void> {
		this.LeerRegistros(await Persistencia.BaseDeDatos().ObtenerConfiguración());
		Consola.Normal('[CONFIGURACIÓN]', `Configuración cargada! (Cantidad de registros: ${Object.keys(this.registros).length})`);
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
			if (isNaN(valorNumerico)) {
				Consola.Error('[CONFIGURACIÓN]', `El registro numérico "${registro.identificador}" no es válido (valor: "${registro.valor})".`);
			}
			this.registros[registro.identificador] = parseInt(registro.valor);
		}
	}

	public Obtener<T extends string | number>(identificador: string): T {
		return this.registros[identificador] as T;
	}
}
