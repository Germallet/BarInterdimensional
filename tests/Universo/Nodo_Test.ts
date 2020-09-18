import { assert } from 'chai';
import * as Prisma from '@prisma/client';
import { Nodo } from '#universo';
import { Persistencia } from '#persistencia';
import { MockBaseDeDatos } from '../Mocks/MockBaseDeDatos';
import { MockServidor } from '../Mocks/MockServidor';

describe('Nodo', function () {
	let servidor: MockServidor;
	let mockBD: MockBaseDeDatos;

	beforeEach(() => {
		mockBD = new MockBaseDeDatos();
		Persistencia.ReemplazarBaseDeDatos(mockBD);
		servidor = new MockServidor();
	});

	it('Generar crea ambos canales (en la API y en BD) si no existen', async function () {
		const nodoPrisma: Prisma.nodo = { id: 123, mundo: 111, nombre: '', canalvoz: null, canaltexto: undefined };
		mockBD.EstablecerNodos([nodoPrisma]);

		const nodo: Nodo = new Nodo(123, 'NodoTest');
		await nodo.Generar(nodoPrisma, servidor, null);
		const nodosPrisma: Prisma.nodo[] = await mockBD.ObtenerNodos(111);

		assert.isTrue(nodo.TieneCanalDeVoz(servidor.ObtenerCanalDeVoz('0')), 'El nodo no obtuvo el correctamente el canal de voz');
		assert.isTrue(nodo.TieneCanalDeTexto(servidor.ObtenerCanalDeTexto('1')), 'El nodo no obtuvo el correctamente el canal de texto');
		assert.isTrue(
			nodosPrisma.every((nodoPrisma) => nodoPrisma.canalvoz == '0' && nodoPrisma.canaltexto == '1'),
			'No se guardaron los nodos en la Base de Datos'
		);
	});

	it('Generar ambos canales (en la API y en BD) si no existen', async function () {
		await servidor.CrearCanalDeVoz('', null);
		await servidor.CrearCanalDeTexto('', null);

		const nodoPrisma: Prisma.nodo = { id: 123, mundo: 111, nombre: '', canalvoz: '0', canaltexto: '1' };
		const nodo: Nodo = new Nodo(123, 'NodoTest');

		await nodo.Generar(nodoPrisma, servidor, null);
		const nodosPrisma: Prisma.nodo[] = await mockBD.ObtenerNodos(111);

		assert.isTrue(nodo.TieneCanalDeVoz(servidor.ObtenerCanalDeVoz('0')), 'El nodo no obtuvo el correctamente el canal de voz');
		assert.isTrue(nodo.TieneCanalDeTexto(servidor.ObtenerCanalDeTexto('1')), 'El nodo no obtuvo el correctamente el canal de texto');
		assert.isTrue(nodosPrisma.length == 0, 'Se guardaron los nodos en la Base de Datos');
	});
});
