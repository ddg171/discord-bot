import Datastore from 'nedb-promises';


const flags:string[] =["replay","role"]

type Flags = {[T in typeof flags[number]]:boolean}

interface Guild {
    id: string;
    _id: string;
    homeChannelId: string;
    invitedBy: string|null;
    flags: Flags;
    createdAt: Date;
    updatedAt: Date;
}
type updatePayload = Partial<Omit<Guild, 'id'|'createdAt'>>;


export class Guilds {
    db:Datastore<Guild>
    constructor(db:Datastore<Guild>){
        this.db=db
    }
    async create(guildId:string,initedBy:string|null=null){
        const config = {
            id: guildId,
            _id: guildId,
            homeChannelId: null,
            initedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docs= await this.db.insert(config);
        return docs;
    }
    async update(guildId:string, payload:updatePayload){
        const doc = await this.db.find({id:guildId});
        if(!doc) throw new Error(`guild not found: ${guildId}`)
        const updatedAt = new Date();
        const result= await  this.db.update({id:guildId},{$set:{...payload,updatedAt}},{returnUpdatedDocs:true})
        return result;
    }
    async findOne(guildId:string){
        const result= await this.db.findOne({id:guildId}) 
        return result;
    }
    async remove(guildId:string){
        const result= await this.db.remove({id:guildId},{})
        return result;
    }
    async enableFlag(guildId:string,flagName:keyof Flags){
        const payload:updatePayload={
            flags:{
                [flagName]:true
            }
        }

        const result= await this.update(guildId,payload)
        return result;
    }
}