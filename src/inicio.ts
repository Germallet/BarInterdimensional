import { Consola } from './Motor/Consola';
import { Universo } from './Motor/Universo';
import { Persistencia } from 'Motor/Persistencia/Persistencia';

class Inicio {
	public async Iniciar(): Promise<void> {
		Consola.Normal('[INICIO]', 'Iniciando');
		await this.IniciarConfiguración();
		Universo.Dios().Conectarse();
	}

	private async IniciarConfiguración(): Promise<void> {
		await Persistencia.Configuración()
			.Cargar()
			.then(() => {
				Consola.Normal('[CONFIGURACIÓN]', `Configuración cargada! (Cantidad de registros: ${Persistencia.Configuración().CantidadDeRegistros()})`);
			})
			.catch((error) => {
				throw error;
			});
	}
}

new Inicio().Iniciar();
