import  Discord,{ Client, GatewayIntentBits,Events } from 'discord.js';
import {TOKEN} from './private'
import {formatISO} from "date-fns"
import { checkError, isNyaan, isPoripori } from "./components/utils";
import { commandList, executeCommand,  responseDM } from "./components/command";
import { BOT_CHANNNEL_NAME } from "./params";

 const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;

 const options = {
    intents: [Guilds, GuildMessages, MessageContent],
};

const client:Client = new Client(options);
client.once('ready', () => {
    console.log('start');
    const myId:string|undefined = client.user?.id 
    if(!myId){
        throw new Error("bot ID not found")
    }
    const myName:string|null = client.user?.username || null
    console.log(`botID:${myId},botName:${myName}`)
    
});
// メッセージが投稿された時
client.on(Events.MessageCreate, (message:Discord.Message) => {
    console.log(message);
    // botは無視
    if(message.author.bot) return
    // 編集も無視
    if( message.editedTimestamp) return
    // 送信者のID
    const senderId:string = message.author.id
    // 送信者のユーザー名
    const senderName:string= message.author.username
    // bot自身のID
    const myId:string|undefined = client.user?.id
    if(!myId){
        throw new Error("bot ID not found")
    }
    const mentionedMember: Discord.Collection<string, Discord.GuildMember> | null = message.mentions.members
    // bot宛のメッセージかどうか
    const isMentioned = !!(mentionedMember && mentionedMember.get(myId))
    // 社会性フィルター検知
    if(isNyaan(message.cleanContent)){
        responseDM(message,'何がニャーンだ。')
        return
    }
    if(isPoripori(message.cleanContent)){
        responseDM(message)
        return
    }
    // bot宛でないなら終了
    if(!isMentioned) return
    // ログ
    console.log(`message from ${senderId}(${senderName}) at ${formatISO(new Date())}`)
    console.log(`channnelName:${(message.channel as Discord.TextChannel).name || 'none'}/id:${message.channel.id}`)
    console.log(`content:${message.content}`)
    console.log(`isMentioned:${isMentioned}`)

    try {
        executeCommand(message,commandList)
    } catch (error) {
        console.log(error)
        const responseText:string= checkError(error)? error.message:"なんもわからん"
        message.channel.send(`<@${senderId}> ${responseText}`)
    }
});

client.login(TOKEN);