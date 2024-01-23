import  { Client, GatewayIntentBits,Events } from 'discord.js';
import { useEventHandlers } from './components/handler';
import  dotenv from 'dotenv';


dotenv.config();



const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const options = {
    intents: [Guilds, GuildMessages, MessageContent],
};
const client:Client = new Client(options);


const {onMessage,onReady} = useEventHandlers(client);
// 起動した時
client.once('ready', onReady);


// メッセージが投稿された時
client.on(Events.MessageCreate, onMessage);

client.login(process.env.TOKEN);