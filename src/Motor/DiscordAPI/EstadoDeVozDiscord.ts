import * as discord from "discord.js";
import { CanalDeVozDiscord } from "./CanalDeVozDiscord";
import { ClienteDiscord } from "./ClienteDiscord";

export class EstadoDeVozDiscord {
    private readonly estado: discord.VoiceState;

    public constructor(estado: discord.VoiceState) {
        this.estado = estado;
    }
    
	public ObtenerCanalDeVoz(): CanalDeVozDiscord {
		return this.estado.channel != undefined ? new CanalDeVozDiscord(this.estado.channel) : null;
    }
    
	public ObtenerCliente(): ClienteDiscord {
		return new ClienteDiscord(this.estado.member);
	}
}