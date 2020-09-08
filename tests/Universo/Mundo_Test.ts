import * as Chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import * as Prisma from '@prisma/client';
import * as Discord from '#discord-api';
import { Mundo } from '#universo';
import { Persistencia } from '#persistencia';
import { MockBaseDeDatos } from '../Mocks/MockBaseDeDatos';
import { MockServidor } from '../Mocks/MockServidor';

describe('Mundo', function () {
	let servidor: MockServidor;
	let mockBD: MockBaseDeDatos;

	beforeEach(() => {
		Chai.use(ChaiAsPromised);
		mockBD = new MockBaseDeDatos();
		Persistencia.ReemplazarBaseDeDatos(mockBD);
		servidor = new MockServidor();
	});

	it('Generar carga la categoría si existe', async function () {
		const categoríaPreexistente: Discord.Categoría = await servidor.CrearCategoría('');

		const mundoPrisma: Prisma.mundo = { id: 1, guild: 'servidorTest', categoria: categoríaPreexistente.ObtenerId() };
		await mockBD.EstablecerMundos([mundoPrisma]);
		const mundo: Mundo = new Mundo(mundoPrisma, servidor);

		await mundo.Generar(mundoPrisma);
		Chai.assert.equal((await mockBD.ObtenerMundos())[0].categoria, categoríaPreexistente.ObtenerId(), 'Se cargó una nueva categoría');
		Chai.assert.equal(servidor.CantidadCategorías(), 1, 'Se cargó una nueva categoría');
	});

	it('Generar crea la categoría (en la API y en BD) si no existe', async function () {
		const mundoPrisma: Prisma.mundo = { id: 1, guild: 'servidorTest', categoria: 'inexistente' };
		await mockBD.EstablecerMundos([mundoPrisma]);
		const mundo: Mundo = new Mundo(mundoPrisma, servidor);

		await mundo.Generar(mundoPrisma);
		Chai.assert.equal((await mockBD.ObtenerMundos())[0].categoria, '0', 'No se cargó una nueva categoría');
		Chai.assert.equal(servidor.CantidadCategorías(), 1, 'No se cargó una nueva categoría');
	});

	it('Generar crea los nodos correspondientes', async function () {
		await mockBD.EstablecerNodos([
			{ id: 1, mundo: 111, nombre: '', canalvoz: null, canaltexto: undefined },
			{ id: 2, mundo: 111, nombre: '', canalvoz: null, canaltexto: undefined },
			{ id: 3, mundo: 111, nombre: '', canalvoz: null, canaltexto: undefined },
			{ id: 44, mundo: 222, nombre: '', canalvoz: null, canaltexto: undefined }
		]);

		const mundoPrisma: Prisma.mundo = { id: 111, guild: 'servidorTest', categoria: 'inexistente' };
		await mockBD.EstablecerMundos([mundoPrisma]);
		const mundo: Mundo = new Mundo(mundoPrisma, servidor);

		await mundo.Generar(mundoPrisma);
		Chai.assert.equal((await mockBD.ObtenerMundos())[0].categoria, '0', 'No se cargó una nueva categoría');
		Chai.assert.equal(servidor.CantidadCanalDeTexto(), 3, 'No se crearon los canales de texto esperados');
		Chai.assert.equal(servidor.CantidadCanalDeVoz(), 3, 'No se crearon los canales de voz esperados');
	});
});
