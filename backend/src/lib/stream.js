import { promoteChannel, StreamChat } from "stream-chat"
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream Api key or Secret key is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret); //connect stream

export const upsertStreamChat = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // create user if not exist or modify if existed
        return userData
    } catch (error) {
        console.error("Error creating stream user:",error);
    }
};

// todo: Later we will create
export const generateStreamToken = (userId) =>{

}
