import {Client,Message,GuildMember,Collection} from 'discord.js';
import { Guilds } from '../model';
import { showMessageLog } from '../utils/messageUtils';

const onReady=(client:Client)=>{
    return () =>{
        console.log('start');
        const myId:string|undefined = client.user?.id
        if(!myId){
            throw new Error("bot ID not found")
        }
        const myName:string|null = client.user?.username || null
        console.log(`botID:${myId},botName:${myName}`)
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onMessage=(client:Client,guilds:Guilds)=>{
    return (message:Message) => {
    const myId:string|undefined = client.user?.id
    // botは無視
    if(message.author.bot) return
    // 編集も無視
    if( message.editedTimestamp) return
    // 送信者のID
    // const senderId:string = message.author.id
    const mentionedMember: Collection<string, GuildMember> | null = message.mentions.members
    // bot宛のメッセージかどうか
    const isMentioned = !!(myId && mentionedMember && mentionedMember.get(myId))
    if(!isMentioned) return
        try {
            showMessageLog(message,myId)
        } catch (error) {
            console.log(error)
        }
    }
}

export const eventHandlers = (client:Client,guilds:Guilds) => {
    return {
        onReady: onReady(client),
        onMessage: onMessage(client,guilds)
    }
}