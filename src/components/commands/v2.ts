import { Message } from 'discord.js';
import * as models from '../../model'; 

export interface CommandResult {
    type:"DM"|"replay"|"message"
    body:string
}

// サーバー設定初期化
function setup(db:models.Guilds){
    return async (message:Message):Promise<CommandResult>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.create(guildId)
        return {
            type:"message",
            body:"success"
        }
    }
}

// サーバー設定削除
function clear(db:models.Guilds){
    return async (message:Message)=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.remove(guildId)
    }
}

// 機能有効化
// function enable(db: DataStore<model.Guilds>) {}

// 機能無効化
// function disable(db: DataStore<model.Guilds>) {}

// 設定一覧表示
function show(db: models.Guilds) {
   return async (message:Message):Promise<CommandResult> => {
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        const result=await db.findOne(guildId);
        console.log(result);
        const body = JSON.stringify(result); 
        return {
            type:"message",
            body
        }
        
    }
}


export const commands = (d: models.Guilds) => {
    return {
        setup: setup(d),
        clear: clear(d),
        show: show(d),
    };
};
