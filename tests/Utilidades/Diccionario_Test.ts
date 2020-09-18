import { Diccionario } from '#utilidades';
import * as Chai from 'chai';

describe('Diccionario', function () {
	it('Agregar elemento no produce errores', function () {
		Chai.assert.doesNotThrow(() => new Diccionario<number, String>().set(123, 'valor'));
	});

	it('Obtener elemento agregado previamente', function () {
		const diccionario: Diccionario<Number, String> = new Diccionario();
		diccionario.set(123, 'valor');
		Chai.assert.equal(diccionario.get(123), 'valor', 'El valor obtenido no es el esperado');
	});

	it('Error al obtener valor inexistente', function () {
		const diccionario: Diccionario<Number, String> = new Diccionario();
		Chai.assert.throws(() => diccionario.get(123), 'No se produjo la excepción esperada');
	});
});
