import * as Discord from '../DiscordAPI/index';
import * as BD from '@prisma/client';
import { Mundo } from './Mundo';
import { Universo } from './Universo';
import { Consola } from './Consola';

export class GestorDeMundos {
	private readonly mundos: Array<Mundo> = new Array<Mundo>();

	public async CargarMundos() {
		const listaMundosBD: BD.mundo[] = await Universo.BaseDeDatos().ObtenerMundos();
		await Promise.all(listaMundosBD.map((mundoBD) => this.CargarMundo(mundoBD.id)));
	}

	public async CargarMundo(id: string) {
		const mundo: Mundo = new Mundo(await Universo.Dios().ObtenerServidor(id));
		this.mundos.push(mundo);
		Consola.Normal('[MUNDOS]', `Mundo cargado (nombre: ${mundo.ObtenerNombre()}, id: ${id})`);
	}

	public ObtenerMundo(id: string) {
		return this.mundos.find((mundo) => mundo.EsServidor(id));
	}

	public ObtenerNodo(canal: Discord.CanalDeVoz) {
		if (canal == null) return null;
		const mundo: Mundo = this.ObtenerMundo(canal.ObtenerIdServidor());
		return mundo != undefined ? mundo.ObtenerNodo(canal) : null;
	}
}
