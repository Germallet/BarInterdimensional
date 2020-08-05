import { BotDiscord } from './BotDiscord';
import { Consola } from './Consola';
import fs from 'fs'
import path from 'path'

/*Consola.Normal('[INICIO]', "Iniciando");
const botDiscord = new BotDiscord();
botDiscord.Conectarse();*/

//const data: String = require('../res/servidor.xml');
const data: String = fs.readFileSync(path.resolve(__dirname, '../res/servidor.xml'), 'utf8');
Consola.Normal("", data);