export function isNyaan(str:string):boolean{
    return !!["ニャーン","ﾆｬｰﾝ","にゃーん","にゃああああああん","にゃあ"].filter((n:string)=>{return str.indexOf(n)>-1}).length
}

export function isPoripori(str:string):boolean{
    return str.indexOf("ポリポリ")>=0
}