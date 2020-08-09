import { Dios } from './Motor/Dios';
import { Consola } from './Motor/Consola';

Consola.Normal('[INICIO]', "Iniciando");
const dios = new Dios();
dios.Conectarse(process.env.DISCORD_BOT_TOKEN);