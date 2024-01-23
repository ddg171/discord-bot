
import {Client,Message,GuildMember,Collection, Guild} from 'discord.js';
import { showMessageLog } from '../utils/messageUtils';
import { commands,checkExistConfig,checkCommand } from './commands/v2';

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
const onMessage=(client:Client)=>{
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
    const guild:Guild|null = message.guild
    if(!isMentioned) return
        try {
            showMessageLog(message,myId)
            // まずはguildを確認
            if(!guild){
                throw new Error("guild not found")
            }
            // 設定データの有無を確認
            const findResult = await checkExistConfig(message)
            // 設定データの確認フラグ
            const hasConfig = !!findResult
            const content = message.cleanContent
            const contentArray = content.split(" ").filter((c)=>!!c).slice(1)
            if(contentArray.length===0) {
                throw new Error("なんもわからん")
            }
            const command = contentArray[0]
            if(!checkCommand(command)){
                throw new Error("コマンドが不正です")
            }
            const result = await commands[command](message,...contentArray)
            console.log(result)
            message.channel.send(content)
        } catch (error) {
            console.log(error)
            message.channel.send("エラーが発生しました")


        }
    }
}

export const useEventHandlers = (client:Client) => {
    return {
        onReady: onReady(client),
        onMessage: onMessage(client)
    }
}