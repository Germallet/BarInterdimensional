import { Usuario } from './Usuario';
import { Mutex } from 'async-mutex';
import { Mundo } from './Mundo';
import { Nodo } from './Nodo';

export class Perfil {
	private readonly usuario: Usuario;
	private readonly mundo: Mundo;
	private readonly mutex: Mutex = new Mutex();

	public constructor(usuario: Usuario, mundo: Mundo) {
		this.usuario = usuario;
		this.mundo = mundo;
	}

	public EsDeMundo(mundo: Mundo): boolean {
		return this.mundo === mundo;
	}

	public async Moverse(origen: Nodo, destino: Nodo): Promise<void> {
		const release = await this.mutex.acquire();

		if (origen !== destino) {
			if (origen != null) await origen.SalirHacia(this.usuario, destino);
			if (destino != null) await destino.LlegarDesde(this.usuario, origen);
		}

		release();
	}
}
