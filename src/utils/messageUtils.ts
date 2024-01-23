import { formatISO } from 'date-fns'
import {Message,Channel,TextChannel,Collection,GuildMember} from 'discord.js';

export const showMessageLog = (message: Message,myId:string|undefined=undefined): void => {
    // 送信者のID
    const senderId:string = message.author.id
    // 送信者のユーザー名
    const mentionedMember: Collection<string, GuildMember> | null = message.mentions.members
    const senderName:string= message.author.username
    const isMentioned = !!(myId &&mentionedMember && mentionedMember.get(myId))
    // ログ
    console.log(`guildName:${message.guild?.name || 'none'}/id:${message.guild?.id}`)
    console.log(`message from ${senderId}(${senderName}) at ${formatISO(new Date())}`)
    console.log(`channnelName:${(message.channel as TextChannel).name || 'none'}/id:${message.channel.id}`)
    console.log(`content:${message.content}`)
    console.log(`isMentioned:${isMentioned}`)
}


export interface CommandResult {
    message:Message
    type:"DM"|"reply"|"message"
    body:string
}

export function responseHandler(result:CommandResult){
    const t = result.type
    if(!result){return}
    if(t==="DM"){
       return result.message.author.send(result.body)
    }
    if(t==="reply"){
        return result.message.reply(result.body)
    }
    if(t==="message"){
        return result.message.channel.send(result.body)
    }
    throw new Error("invalid type")
}
