import { Universo } from '#universo';
import { Persistencia } from '#persistencia';
import { Consola } from './Consola';

class Inicio {
	public async Iniciar(): Promise<void> {
		Consola.Normal('[INICIO]', 'Iniciando');
		await this.IniciarConfiguración();
		Universo.Dios().Conectarse();
	}

	private async IniciarConfiguración(): Promise<void> {
		return Persistencia.Configuración()
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
