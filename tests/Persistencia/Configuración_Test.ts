import { assert } from 'chai';
import { Persistencia } from '#persistencia';
import { MockBaseDeDatos } from '../Mocks/MockBaseDeDatos';

describe('Configuración', function () {
	const mockBD: MockBaseDeDatos = new MockBaseDeDatos();

	beforeEach(() => {
		Persistencia.ReemplazarBaseDeDatos(mockBD);
		mockBD.EstablecerConfiguración([
			{ identificador: 'texto1', valor: 'valor1', numerico: false },
			{ identificador: 'numero123', valor: '123', numerico: true }
		]);
	});

	it('Cargar con valores válidos no produce errores', function () {
		assert.isFulfilled(Persistencia.Configuración().Cargar());
	});

	it('No pueden existir valores no numéricos como tal', function () {
		mockBD.EstablecerConfiguración([
			{ identificador: 'texto1', valor: 'valor1', numerico: false },
			{ identificador: 'numero123', valor: '123', numerico: true },
			{ identificador: 'textoComoNumero', valor: 'deberiaSerUnNumero', numerico: true }
		]);
		assert.isRejected(Persistencia.Configuración().Cargar(), 'El registro numérico "textoComoNumero" no es válido (valor: "deberiaSerUnNumero)"');
	});

	it('Obtener string válido', function () {
		Persistencia.Configuración().Cargar();
		assert.equal(Persistencia.Configuración().Obtener<string>('texto1'), 'valor1', 'No se pudo obtener correcamente');
	});

	it('Obtener número válido', function () {
		Persistencia.Configuración().Cargar();
		assert.equal(Persistencia.Configuración().Obtener<number>('numero123'), 123, 'No se pudo obtener correcamente');
	});

	it('Obtener string inexistente produce excepción', function () {
		Persistencia.Configuración().Cargar();
		assert.throws(() => Persistencia.Configuración().Obtener<string>('inexistente'), 'El registro buscado no existe');
	});

	it('Obtener número inexistente produce excepción', function () {
		Persistencia.Configuración().Cargar();
		assert.throws(() => Persistencia.Configuración().Obtener<number>('inexistente'), 'El registro buscado no existe');
	});
});
