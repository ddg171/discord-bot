/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import { CommandResult } from '../../utils/messageUtils';
import * as models from '../../model/index';
import  dotenv from 'dotenv';
import DataStore from 'nedb-promises';
import { join } from 'path';

dotenv.config();



const d = DataStore.create({
    filename: join(__dirname, 'data', 'guilds.db'),
    autoload: true,
    });

    const db = new models.Guilds(d);

export const checkExistConfig = async (message:Message):Promise<boolean>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        const result=await db.findOne(guildId);
        return !!result;
    }
// サーバー設定初期化
const setUp =  async (message:Message,..._:(string|number)[]):Promise<CommandResult>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.create(guildId)
        return {
            message,
            type:"message",
            body:"setup"
        }
    }

// サーバー設定削除
const clear = async (message:Message,..._:(string|number)[]):Promise<CommandResult>=>{
        const guildId = message.guild?.id
        if(!guildId){ throw new Error("guildId not found")}
        await db.remove(guildId)
        return {
            message,
            type:"message",
            body:"clear"
        }
    }


// 機能有効化
// const enable = (message:Message){}

// 機能無効化
// const disable = (message:Message){}

// 設定一覧表示
const show = async (message:Message,..._:(string|number)[]):Promise<CommandResult> => {
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


export const commands = {
    setUp,
    clear,
    show,
}


export const checkCommand = (v:unknown):v is keyof typeof commands  => {
    return typeof v === "string" && Object.keys(commands).includes(v)
}
