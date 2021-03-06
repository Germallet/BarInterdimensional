import { Dios } from './Dios';
import { GestorDeUsuarios } from '#usuario';
import { GestorDeMundos } from './GestorDeMundos';

export class Universo {
	private static readonly dios: Dios = new Dios();
	private static readonly mundos: GestorDeMundos = new GestorDeMundos();
	private static readonly usuarios: GestorDeUsuarios = new GestorDeUsuarios();

	public static Dios(): Dios {
		return this.dios;
	}

	public static Mundos(): GestorDeMundos {
		return this.mundos;
	}

	public static Usuarios(): GestorDeUsuarios {
		return this.usuarios;
	}
}
