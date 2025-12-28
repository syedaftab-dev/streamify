import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {

    try {
        const token = generateStreamToken(req.user.id);

        res.status(200).json({token}); // send token as response to client
        // this toeken will be used to connect to stream chat from client side
    } catch (error) {
        console.error("Error in getStreamToken:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}