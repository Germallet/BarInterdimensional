import * as Discord from '#discord-api';
import { MockCanalDeTexto } from './MockCanalDeTexto';
import { MockCanalDeVoz } from './MockCanalDeVoz';
import { MockCategoría } from './MockCategoría';

export class MockServidor extends Discord.Servidor {
	private últimoID: number = 0;
	private readonly categorías: Array<[string, Discord.Categoría]> = new Array<[string, Discord.Categoría]>();
	private readonly canalesDeTexto: Array<[string, Discord.CanalDeTexto]> = new Array<[string, Discord.CanalDeTexto]>();
	private readonly canalesDeVoz: Array<[string, Discord.CanalDeVoz]> = new Array<[string, Discord.CanalDeVoz]>();

	public constructor() {
		super(null);
	}

	public async CrearCategoría(nombre: string): Promise<Discord.Categoría> {
		const nuevaCategoría: Discord.Categoría = new MockCategoría(this.últimoID.toString());
		this.categorías.push([this.últimoID.toString(), nuevaCategoría]);
		this.últimoID++;
		return nuevaCategoría;
	}

	public async CrearCanalDeTexto(nombre: string, categoría: Discord.Categoría): Promise<Discord.CanalDeTexto> {
		const nuevoCanal: Discord.CanalDeTexto = new MockCanalDeTexto(this.últimoID.toString());
		this.canalesDeTexto.push([this.últimoID.toString(), nuevoCanal]);
		this.últimoID++;
		return nuevoCanal;
	}

	public async CrearCanalDeVoz(nombre: string, categoría: Discord.Categoría): Promise<Discord.CanalDeVoz> {
		const nuevoCanal: Discord.CanalDeVoz = new MockCanalDeVoz(this.últimoID.toString());
		this.canalesDeVoz.push([this.últimoID.toString(), nuevoCanal]);
		this.últimoID++;
		return nuevoCanal;
	}

	public ObtenerCategoría(id: string): Discord.Categoría {
		const tupla: [string, Discord.Categoría] = this.categorías.find((tupla) => tupla[0] == id);
		if (tupla == undefined) throw new Error(`No se pudo obtener la categoría ${id}`);
		return tupla[1];
	}

	public CantidadCategorías() {
		return this.categorías.length;
	}

	public ObtenerCanalDeTexto(id: string): Discord.CanalDeTexto {
		const tupla: [string, Discord.CanalDeTexto] = this.canalesDeTexto.find((tupla) => tupla[0] == id);
		if (tupla == undefined) throw new Error(`No se pudo obtener el canal de texto ${id}`);
		return tupla[1];
	}

	public CantidadCanalDeTexto() {
		return this.canalesDeTexto.length;
	}

	public ObtenerCanalDeVoz(id: string): Discord.CanalDeVoz {
		const tupla: [string, Discord.CanalDeVoz] = this.canalesDeVoz.find((tupla) => tupla[0] == id);
		if (tupla == undefined) throw new Error(`No se pudo obtener el canal de voz ${id}`);
		return tupla[1];
	}

	public CantidadCanalDeVoz() {
		return this.canalesDeVoz.length;
	}

	public ObtenerClientes(): Discord.Cliente[] {
		return new Array<Discord.Cliente>();
	}
}
