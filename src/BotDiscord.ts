import * as discord from "discord.js";

export class BotDiscord 
{
	private readonly cliente: discord.Client = new discord.Client();

	public Conectarse(): void 
	{
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);
		this.cliente.login(process.env.DISCORD_BOT_TOKEN).then(()=>this.CrearCanal('Prueba')); // PROMESA
	}

	private OnReady() 
	{
		console.log('Conectado!');
		
		this.ObtenerServidor().createChannel('this.nombre', { type: 'text' });
		this.ObtenerServidor().createChannel('this.nombre', { type: 'voice' });
		


	}
	private async OnMessage(message: discord.Message, client: discord.Client) 
	{
		console.log(`Nuevo mensaje: ${message.content}`);	
		console.log(`Nuevo mensaje: ${message.guild.id}`);
		
		this.ObtenerServidor().channels.get('this.nombre').delete();
	}

	private ObtenerServidor(): discord.Guild { return this.cliente.guilds.get('696105418065313934'); }
	
	private CrearCanal(nombre: string)
	{
		this.ObtenerServidor().createChannel(nombre, { type: 'text' }); // PROMESA
	}
	private CrearRol(nombre: string)
	{
		this.ObtenerServidor().createRole({ name: nombre }); // PROMESA
	}
}