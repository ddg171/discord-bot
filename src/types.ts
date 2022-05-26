import Discord from "discord.js"


// パース関数で使用するコマンドとコールバックのobject
export type CommandMap={[K :string]:(message:Discord.Message,option?:string)=>void}