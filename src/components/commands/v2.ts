import { Message } from 'discord.js';
import * as models from '../../model'; 
import { CommandResult } from '../../utils/messageUtils';




// サーバー設定初期化
export function _setUp(db:models.Guilds){
    return async (message:Message):Promise<CommandResult>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.create(guildId)
        return {
            message,
            type:"message",
            body:"setup"
        }
    }
}

// サーバー設定削除
function clear(db:models.Guilds){
    return async (message:Message):Promise<CommandResult>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.remove(guildId)
        return {
            message,
            type:"message",
            body:"clear"
        }
    }
}

// 機能有効化
// function enable(db: DataStore<model.Guilds>) {}

// 機能無効化
// function disable(db: DataStore<model.Guilds>) {}

// 設定一覧表示
function show(db: models.Guilds):Promise<CommandResult> {
   return async (message:Message):Promise<CommandResult> => {
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        const result=await db.findOne(guildId);
        console.log(result);
        const body = JSON.stringify(result);
        return {
            message,
            type:"message",
            body
        }
    }
}

export const setUp = (d: models.Guilds) => _setUp(d)

export const commands = (d: models.Guilds) => {
    return {

        clear: clear(d),
        show: show(d),
    };
};
