import { BaseDeDatos } from './BaseDeDatos';
import { Configuración } from './Configuración';

export class Persistencia {
	private static readonly baseDeDatos: BaseDeDatos = new BaseDeDatos();
	private static readonly configuración: Configuración = new Configuración();

	public static BaseDeDatos(): BaseDeDatos {
		return this.baseDeDatos;
	}

	public static Configuración(): Configuración {
		return this.configuración;
	}
}
