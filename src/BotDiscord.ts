import * as discord from "discord.js";

export class BotDiscord 
{
	private readonly cliente: discord.Client = new discord.Client();

	public Conectarse(): void 
	{
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);
		this.cliente.login(process.env.DISCORD_BOT_TOKEN).then(()=>this.CrearCanal());
	}

	private OnReady() 
	{
		console.log('Conectado!');
	}
	private async OnMessage(message: discord.Message, client: discord.Client) 
	{
		console.log(`Nuevo mensaje: ${message.content}`);	
		console.log(`Nuevo mensaje: ${message.guild.id}`);
		
	}

	private CrearCanal()
	{
		this.cliente.guilds.get('696105418065313934').createChannel('Canal_De_Prueba', 'text')
		.then(console.log)
		.catch(console.error);
		console.log('Canal Creado');
	}
}