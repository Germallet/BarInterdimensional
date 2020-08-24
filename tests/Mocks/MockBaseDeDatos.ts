import * as Motor from '#motor';
import * as BD from '@prisma/client';

export class MockBaseDeDatos extends Motor.BaseDeDatos {
	private configuración: BD.configuracion[];

	public async EstablecerConfiguración(configuración: BD.configuracion[]) {
		this.configuración = configuración;
	}

	public async ObtenerConfiguración(): Promise<BD.configuracion[]> {
		return this.configuración;
	}
}
