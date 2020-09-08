import * as Chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import { Comando, ComandoIntermedio, ComandoFinal, GestorDeComandos } from '#bot';

describe('Comandos', function () {
	let valorGlobal: number;
	const gestor: GestorDeComandos = new GestorDeComandos('-');
	const operación: ComandoIntermedio = new ComandoIntermedio(['operación'], null);
	const sumarUno: ComandoFinal = new ComandoFinal(['sumarUno'], () => (valorGlobal = valorGlobal + 1));
	const tresVeces: ComandoIntermedio = new ComandoIntermedio(['tresVeces'], (comando: Comando, parámetros: Array<string>, adjuntosDeMensaje) => {
		for (let i = 0; i < 3; i++) {
			const nuevosParámetros: Array<string> = new Array<string>();
			parámetros.forEach((parámetro) => {
				nuevosParámetros.push(parámetro);
			});
			comando.Ejecutar(nuevosParámetros, adjuntosDeMensaje);
		}
	});

	beforeEach(() => {
		Chai.use(ChaiAsPromised);
		valorGlobal = 0;
		operación.AgregarComando(sumarUno);
		tresVeces.AgregarComando(operación);
		gestor.AgregarComando(operación);
		gestor.AgregarComando(tresVeces);
	});

	it('Ejecutar el comando sumarUno suma 1 al valor global', function () {
		sumarUno.Ejecutar(null, null);
		Chai.assert.equal(1, valorGlobal);
	});

	it('El comando operacion entiende sumarSumar y lo ejecuta', function () {
		const nombreSumarUno: string = sumarUno.ObtenerNombre();
		operación.Ejecutar([nombreSumarUno], null);
		Chai.assert.equal(1, valorGlobal);
	});

	it('El comando operacion no entiende sumarDos', function () {
		const nombreSumarTres: string = 'sumarTres';
		Chai.assert.isRejected(operación.Ejecutar([nombreSumarTres], null), 'El comando "operación" no entiende "sumarTres".');
	});

	it('El gestor lee -Operación sumarUno y suma 1 al valor global', function () {
		gestor.LeerComando('-operación sumarUno', null);
		Chai.assert.equal(1, valorGlobal);
	});

	it('El gestor lee - Operación sumarUno y suma 1 al valor global', function () {
		gestor.LeerComando('- operación sumarUno', null);
		Chai.assert.equal(1, valorGlobal);
	});

	it('-TresVeces Operación sumarUno y suma 3 al valor global', function () {
		gestor.LeerComando('-tresVeces operación sumarUno', null);
		Chai.assert.equal(3, valorGlobal);
	});
});
