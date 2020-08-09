import { BotDiscord } from './Motor/BotDiscord';
import { Consola } from './Motor/Consola';

Consola.Normal('[INICIO]', "Iniciando");
const botDiscord = new BotDiscord();
botDiscord.Conectarse();