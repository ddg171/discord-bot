
export const isMentionToBot = (message:Discord.Message):boolean=>{
    const mentionedMember: Discord.Collection<string, Discord.GuildMember> | null = message.mentions.members
    const myId:string|undefined = message.client.user?.id
    // bot宛のメッセージかどうか
    const isMentioned = !!(mentionedMember && mentionedMember.get(myId))
    return isMentioned
}

export const isDM = (message:Discord.Message):boolean=>{
    const channel:Discord.Channel = message.channel
    const isDM = channel.type === 'DM'
    return isDM
}

export const isGuildMessage = (message:Discord.Message):boolean=>{
    const channel:Discord.Channel = message.channel
    const isGuildMessage = channel.type === 'GUILD_TEXT'
    return isGuildMessage
}
