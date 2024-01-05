import DataStore from 'nedb-promise';
import { join } from 'path';

const db = new DataStore({
    filename: join(__dirname, 'db', 'configs.db'),
    autoload: true,
    });


export const createGuildConfig = async (guildId:string,channelId:string) => {
        const config = {
            id: guildId,
            channelId: ChannelId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.insert(config);
    }
