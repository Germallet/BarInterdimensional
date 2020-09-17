import { Nodo, Universo, Mundo } from '#universo';
import { XML, XMLList } from 'sxml';
import { Persistencia } from './Persistencia';

export class GeneradorXML {
	private readonly xml: XML;

	public constructor(contenido: string) {
		this.xml = new XML(contenido);
	}

	private async CargarOCrearMundo(guild: string): Promise<Mundo> {
		let mundo: Mundo;
		try {
			mundo = Universo.Mundos().ObtenerMundo(guild);
		} catch {
			const idMundo = await Persistencia.BaseDeDatos().CrearMundo({ guild: guild });
			mundo = await Universo.Mundos().CrearMundo(idMundo, guild);
		}
		return mundo;
	}

	public async Generar(): Promise<void> {
		const mundo: Mundo = await this.CargarOCrearMundo(this.xml.get('mundo').at(0).getProperty('guild'));
		await mundo.BorrarNodos();

		const nodosXML: XMLList = this.xml.get('nodos').at(0).get('nodo');
		const nodos: Array<[string, { id: number; nodo: Nodo }]> = new Array<[string, { id: number; nodo: Nodo }]>();

		for (const nodoXML of nodosXML) {
			nodos.push([nodoXML.getProperty('id'), await mundo.CrearNodo(nodoXML.getProperty('nombre'))]);
		}

		for (const nodoXml of nodosXML) {
			if (nodoXml.get('adyacentes').at(0).size() == 0) continue;
			const nodo: [string, { id: number; nodo: Nodo }] = nodos.find((tupla) => tupla[0] == nodoXml.getProperty('id'));
			const adyacentes: XMLList = nodoXml.get('adyacentes').at(0).get('adyacente');

			for (const adyacente of adyacentes) {
				const nodoAdyacente: { id: number; nodo: Nodo } = nodos.find((tupla) => tupla[0] == adyacente.getProperty('id'))[1];
				await nodo[1].nodo.AgregarAdyacente(nodoAdyacente.nodo, nodoAdyacente.id);
			}
		}

		mundo.EstablecerNodoInicial(nodos[0][1].nodo);
		mundo.GenerarPerfiles();
	}
}
