import { Usuario } from './Usuario';
import { Mundo } from './Mundo';

export class Perfil {
	private readonly usuario: Usuario;
	private readonly mundo: Mundo;

	public constructor(usuario: Usuario, mundo: Mundo) {
		this.usuario = usuario;
		this.mundo = mundo;
	}

	public EsDeMundo(mundo: Mundo): boolean {
		return this.mundo === mundo;
	}
}
