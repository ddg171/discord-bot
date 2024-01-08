import {Client,Message,GuildMember,Collection} from 'discord.js';
import { Guilds } from '../model';
import { showMessageLog } from '../utils/messageUtils';
import { CommandResult,commands } from './commands/v2';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const onMessage=(client:Client,guilds:Guilds,commands:{[T:string]:any})=>{
    return async (message:Message) => {
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
            const content = message.cleanContent
            const contentArray = content.split(" ").filter((c)=>!!c).slice(1)
            if(contentArray.length===0) {
                throw new Error("なんもわからん")
            }
            console.log(contentArray)
            const command = contentArray[0]
            if(!commands[command]){
                throw new Error("何を言いたいのかわからん")
            }
            const result = await commands[command](message,...contentArray.slice(1))
            console.log(result)
            message.channel.send(content)
        } catch (error) {
            console.log(error)
            message.channel.send("エラーが発生しました")


        }
    }
}

export const eventHandlers = (client:Client,guilds:Guilds) => {
    return {
        onReady: onReady(client),
        onMessage: onMessage(client,guilds,commands(guilds))
    }
}