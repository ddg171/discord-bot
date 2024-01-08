import  { Client, GatewayIntentBits,Events } from 'discord.js';
import * as models from './model';
import { eventHandlers } from './components/handler';
import  dotenv from 'dotenv';
import DataStore from 'nedb-promises';
import { join } from 'path';

dotenv.config();


const db = DataStore.create({
    filename: join(__dirname, 'data', 'guilds.db'),
    autoload: true,
    });
const guilds = new models.Guilds(db);


const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const options = {
    intents: [Guilds, GuildMessages, MessageContent],
};
const client:Client = new Client(options);


const {onMessage,onReady} = eventHandlers(client,guilds);
// 起動した時
client.once('ready', onReady);


// メッセージが投稿された時
client.on(Events.MessageCreate, onMessage);

client.login(process.env.TOKEN);