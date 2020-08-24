import * as Chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import * as Motor from '#motor';
import { MockBaseDeDatos } from '../../Mocks/MockBaseDeDatos';

describe('Configuración', function () {
	const mockBD: MockBaseDeDatos = new MockBaseDeDatos();

	beforeEach(() => {
		Chai.use(ChaiAsPromised);
		Motor.Persistencia.ReemplazarBaseDeDatos(mockBD);
		mockBD.EstablecerConfiguración([
			{ identificador: 'texto1', valor: 'valor1', numerico: false },
			{ identificador: 'numero123', valor: '123', numerico: true }
		]);
	});

	it('Cargar con valores válidos no produce errores', function () {
		Chai.assert.isFulfilled(Motor.Persistencia.Configuración().Cargar());
	});

	it('No pueden existir valores no numéricos como tal', function () {
		mockBD.EstablecerConfiguración([
			{ identificador: 'texto1', valor: 'valor1', numerico: false },
			{ identificador: 'numero123', valor: '123', numerico: true },
			{ identificador: 'textoComoNumero', valor: 'deberiaSerUnNumero', numerico: true }
		]);
		Motor.Persistencia.Configuración().Cargar();

		Chai.assert.isRejected(Motor.Persistencia.Configuración().Cargar(), 'El registro numérico "textoComoNumero" no es válido (valor: "deberiaSerUnNumero)"');
	});

	it('Obtener string válido', function () {
		Motor.Persistencia.Configuración().Cargar();
		Chai.assert.equal(Motor.Persistencia.Configuración().Obtener<string>('texto1'), 'valor1', 'No se pudo obtener correcamente');
	});

	it('Obtener número válido', function () {
		Motor.Persistencia.Configuración().Cargar();
		Chai.assert.equal(Motor.Persistencia.Configuración().Obtener<number>('numero123'), 123, 'No se pudo obtener correcamente');
	});

	it('Obtener string inexistente produce excepción', function () {
		Motor.Persistencia.Configuración().Cargar();
		Chai.assert.throws(() => Motor.Persistencia.Configuración().Obtener<string>('inexistente'), 'El registro buscado no existe');
	});

	it('Obtener número inexistente produce excepción', function () {
		Motor.Persistencia.Configuración().Cargar();
		Chai.assert.throws(() => Motor.Persistencia.Configuración().Obtener<number>('inexistente'), 'El registro buscado no existe');
	});
});
