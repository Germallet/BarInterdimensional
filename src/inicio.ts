import { Consola } from './Motor/Consola';
import { Universo } from './Motor/Universo';
import { Persistencia } from 'Motor/Persistencia/Persistencia';

(async () => {
	try {
		Consola.Normal('[INICIO]', 'Iniciando');
		await Persistencia.Configuración().Cargar();
		Universo.Dios().Conectarse();
	} catch (e) {
		throw e;
	}
})();
