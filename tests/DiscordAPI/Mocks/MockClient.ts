import * as Discord from 'discord.js';
import { rejects } from 'assert';

export class MockClient extends Discord.Client {
	public login(token?: string): Promise<string> {
		return new Promise<string>((resolve, reject) => (token == 'test-bot-token' ? resolve(token) : reject('Token inválido')));
	}

	/*public on(token: string): void {
		if (token != 'test-bot') throw new exception('Token inválido');
	}*/
}
