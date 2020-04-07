/*import {
  Discord,
  On,
  Client // Use the Client that are provided by @typeit/discord
} from "@typeit/discord";
// You must import the types from @types/discord.js
import {
  Message
} from "discord.js";

// Decorate the class with the @Discord decorator
@Discord
export class AppDiscord {
  private static _client: Client;
  private _prefix: string = "!";
  private _sayHelloMessage: string = "hello !";
  private _commandNotFoundMessage: string = "command not found...";

  static start() {
    this._client = new Client();
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    console.log("AA");
    this._client.login(
      "YOUR_TOKEN",
      `${__dirname}/*Discord.ts` // glob string to load the classes
    );
  }

  // When the "message" event is triggered, this method is called with a specific payload (related to the event)
  @On("message")
  async onMessage(message: Message, client: Client) {
    // Your logic...
    if (AppDiscord._client.user.id !== message.author.id) {
      if (message.content[0] === this._prefix) {
        const cmd = message.content.replace(this._prefix, "").toLowerCase();
        switch (cmd) {
          case "hello":
            message.reply(this._sayHelloMessage);
            break;
          default:
            message.reply(this._commandNotFoundMessage);
            break;  
        }
      }
    }
  }
}

// Start your app
AppDiscord.start();*/

import * as discord from "discord.js";

export class BotDiscord {
	private readonly cliente: discord.Client = new discord.Client();

	public Conectarse(): void {
		this.cliente.on('ready', this.OnReady);
		this.cliente.on('message', this.OnMessage);
		this.cliente.login(process.env.DISCORD_BOT_TOKEN);
	}
	
	private OnReady() {
		console.log('Conectado!');
	}
	private async OnMessage(message: discord.Message, client: discord.Client) {
		console.log(`Nuevo mensaje: ${message.content}`);
	}
}