import { assert } from 'chai';
import * as Discord from '#discord-api';
import { MockClient } from './Mocks/MockClient';
import { doesNotMatch } from 'assert';

describe('BotDiscord', function () {
	let bot: Discord.Bot;

	before(() => Discord.Servicio.ReemplazarInstanciador(() => new MockClient()));
	beforeEach(() => (bot = new Discord.Bot()));

	it('Conectarse con Token válido', async function () {
		await bot
			.Conectarse('test-bot-token')
			.then((state) => {})
			.catch((error) => assert.fail('Se rechazó un token válido'));
	});

	it('Conectarse con Token inválido', async function () {
		return bot
			.Conectarse('Token inválido')
			.then((state) => assert.fail('Se aceptó un token inválido'))
			.catch((error) => {});
	});
});
