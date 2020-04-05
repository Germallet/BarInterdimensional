//import express from 'express';
import { BotDiscord } from './BotDiscord';

const PORT = process.env.PORT || 80;
/*const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));*/

const botDiscord = new BotDiscord();
botDiscord.Start();