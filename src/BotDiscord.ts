import * as discord from "discord.js";
import { Mundo } from "./Mundo";
import { Consola } from "./Consola";

export class BotDiscord 
{
	private readonly cliente: discord.Client = new discord.Client();

	public async Conectarse() 
	{
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);
		await this.cliente.login(process.env.DISCORD_BOT_TOKEN); // PROMESA
		this.CrearMundos();
	}

	private OnReady() 
	{
		Consola.Normal('[DISCORD]', 'Conectado!');
	}
	private async OnMessage(message: discord.Message, client: discord.Client) 
	{
		Consola.Normal('[DISCORD]', `Nuevo mensaje: ${message.content}`);	
		Consola.Normal('[DISCORD]', `Nuevo mensaje: ${message.guild.id}`);
	}

	private async CrearMundos()
	{
		let mundo:Mundo = new Mundo(this.cliente.guilds.get('693469047336992800')); //696105418065313934
		await mundo.Generar();
	}
}