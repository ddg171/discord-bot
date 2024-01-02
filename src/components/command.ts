import { CommandMap } from "../types";
import {PROTECTED_ROLES} from "../params"
import Discord from "discord.js"

// 使用可能なコマンド一覧
// const commandList:string =['roles','set','remove']

export const commandList:CommandMap ={
    // 役職一覧表示
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    help:(message:Discord.Message,__:string|undefined=undefined)=>{
        message.channel.send("'roles' :権限一覧をプライベートメッセージで送信します。\n")
        message.channel.send("'set [ロールを半角スペース区切り]' :指定したロールを付与します。\n")
        message.channel.send("'remove [ロールを半角スペース区切り]' :指定したロールをユーザーから削除します。\n")
        message.channel.send("'set [ロールを半角スペース区切り]' :指定したロールを付与します。\n")
        message.channel.send("'show [ロール]' :指定したロールがコマンドで操作可能か表示します。\n")
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roles:(message:Discord.Message,__:string|undefined=undefined)=>{
        const roleList :string[] = getRoleList(message)
        message.author.send(["サーバー内ロール一覧:",...roleList].join("\n"))
    },
    // set:(message:Discord.Message,roleName:string|undefined=undefined)=>{
    //     const guild:Discord.Guild|null =message.guild
    //     if(!guild){
    //         throw Error("ﾇｰﾝ")
    //     }
    //     const role:Discord.Role|null = findRole(roleName,guild)
    //     if(!role){
    //         throw Error('ロールがわからん')
    //     }
    //     if(isProtectedRoll(roleName,PROTECTED_ROLES)){
    //         throw Error('そのロールは無理')
    //     }
    //     const target:Discord.User =message.author 
    //     setRole(target,role,guild).then(()=>{
    //         response(message,`ロール付与:${roleName}`)
    //     })    
        
    // },
    // remove:(message:Discord.Message,roleName:string|undefined=undefined)=>{
    //     const guild:Discord.Guild|null =message.guild
    //     if(!guild){
    //         throw Error("ﾇｰﾝ")
    //     }
    //     const role:Discord.Role|null = findRole(roleName,guild)
    //     if(!role){
    //         throw Error('ロールがわからん')
    //     }
    //     if(isProtectedRoll(roleName,PROTECTED_ROLES)){
    //         throw Error('そのロールは無理')
    //     }
    //     const target:Discord.User =message.author 
    //     removeRole(target,role,guild).then(()=>{
    //         response(message,`ロール削除:${roleName}`)
    //     })    
    // },
    show:(message:Discord.Message,roleName:string|undefined=undefined)=>{
        const guild:Discord.Guild|null =message.guild
        if(!guild){
            throw Error("ﾇｰﾝ")
        }
        const role:Discord.Role|null = findRole(roleName,guild)
        if(!role){
            response(message,`そんなものはない`)
            return
        }
        if(isProtectedRoll(roleName,PROTECTED_ROLES)){
            response(message,`ロール名:${roleName}/選択不可`) 
            return
        }
        response(message,`ロール名:${roleName}/選択可能`)  
    },
}


// 入力されたコマンドをパースする関数
export function executeCommand(message:Discord.Message,commandMap:CommandMap):void{
    const str :string = message.cleanContent
    if(!str){
        throw new Error('ポリポリ')
    }
    // まず半角スペースでバラす。
    // 0番目はメンションの宛先なので破棄
    const command:string[] = str.replace("　"," ").split(' ').filter((s:string)=>s).slice(1)

    // 要素数が足りない場合はエラー
    if(!command.length){
        throw new Error('何が言いたいのかわからん')
    }
    if(command[0].toString()==="ポリポリ"){
        response(message,'ポリポリ')
        return
    }
    // 第２引数のkeyとコマンドが一致するか処理を回す。
    const oparation:((message: Discord.Message,S?:string)=>void)|undefined =commandMap[command[0].toString().toLowerCase()]
    if(!oparation){
        throw new Error('何をしたいのかわからん')
    }
    // 一致したものがあれば実行
    // 複数のロールに対応する
    console.log("command match")
    const options:string|string[]=command.length>1? command.slice(1):command[1]
    if(!options || typeof options === "string"){
        oparation(message,options)
        return
    }
    options.forEach((o:string)=>{
        try {
            oparation(message,o)
        } catch (err) {
            if( err instanceof Error){
                throw err
            }
            throw Error('何もわからん')
        }
    })
}

// 名前からロールを探す関数
// 見つからないか、引数がおかしい場合はnull
function findRole(roleName:string|undefined,guild: Discord.Guild):Discord.Role|null{
    if(!roleName) return null
    try {
        return guild?.roles?.cache?.find(role => role.name === roleName) ||null
    } catch  {
        return null
    }
}

function isProtectedRoll(roleName:string|undefined,ProtectedRoles:string[]=[]):boolean{
    if(!roleName) return false
    return ProtectedRoles.findIndex((r:string)=>r===roleName)>=0
}

// 送信者あてのメンションを作る関数
function mention(message:Discord.Message):string{
    const senderId:string = message.author.id
    return senderId? `<@${senderId}>` :''
}

// ロールをつける関数
// async function setRole(target:Discord.User ,role:Discord.Role,guild:Discord.Guild):Promise<void>{
//     const guildUser = guild.member(target)
//     if(!guildUser){
//         throw Error('誰かわからん')
//     }
//     return await guildUser.roles.add(role).then(()=>{return})
// }

// ロールを外す関数
// async function removeRole(target:Discord.User ,role:Discord.Role,guild:Discord.Guild):Promise<void>{
//     const guildUser = guild.member(target)
//     if(!guildUser){
//         throw Error('多分鯖にいない人なんでわからん')
//     }
//     return await guildUser.roles.remove(role).then(()=>{return })
// }

// ロール一覧表示
export function getRoleList(message:Discord.Message):string[]{
    try {    
        const roles:string[]|undefined = message.guild?.roles?.cache.map((role)=>{return role.name})
        return roles?.filter(r=>r !== '@everyone') || []
    } catch (error) {
        console.log(error)
        return []
    }
}

export function response(message:Discord.Message,str='ポリポリ'):void{
    message.channel.send(`${mention(message)} \n${str}`)
}

export function responseDM(message:Discord.Message,str="ポリポリ"):void{
    const guildName:string =message.guild?.name || ""
    message.author.send(`${guildName}${guildName?'からの通知:':'通知:'}\n`+str)
}