import { formatISO } from 'date-fns'
import {Message,Channel,TextChannel,Collection,GuildMember} from 'discord.js';

export const isMentionToBot = (message: Message): boolean => {
    const mentionedMember: Collection<string, GuildMember> | null = message.mentions.members
    const myId: string | undefined = message.client.user?.id
    // bot宛のメッセージかどうか
    const isMentioned = !!(mentionedMember && mentionedMember.get(myId))
    return isMentioned
}

export const isDM = (message: Message): boolean => {
    const channel: Channel = message.channel
    const isDM = channel.type ===1
    return isDM
}

export const isGuildMessage = (message: Message): boolean => {
    const channel: Channel = message.channel
    const isGuildMessage = channel.type === 0
    return isGuildMessage
}

export const showMessageLog = (message: Message,myId:string|undefined=undefined): void => {
    // 送信者のID
    const senderId:string = message.author.id
    // 送信者のユーザー名
    const mentionedMember: Collection<string, GuildMember> | null = message.mentions.members
    const senderName:string= message.author.username
    const isMentioned = !!(myId &&mentionedMember && mentionedMember.get(myId))
    // ログ
    console.log(`message from ${senderId}(${senderName}) at ${formatISO(new Date())}`)
    console.log(`channnelName:${(message.channel as TextChannel).name || 'none'}/id:${message.channel.id}`)
    console.log(`content:${message.content}`)
    console.log(`isMentioned:${isMentioned}`)
}