import User from "../model/User.js";
import FriendRequest from "../model/friendRequest.js";

export async function getRecommendedUsers(req,res){

   try {
         const userId = req.user.id;
        const user = req.user;
        // get freinds and user who onboarded succesfully on user dashboard
        const recommendedUsers = await User.find({
            $and:[
                {_id: {$ne: userId}}, // not equal to userId
                {isOnBoarding: true}, // who onboarded succesfully
                {_id: {$nin: user.friends}} // not in friends list
            ]
        });

        res.status(200).json(recommendedUsers);
   } catch (error) {
        console.log("Error in getRecommendedUsers controller",error.message);
        res.status(500).json({ message: "internal server Error" });
   }
}

export async function getMyFriends(req,res){
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller",error.message);
        res.status(500).json({ message: "internal server Error" });
    }
}


export async function sendFriendRequest(req,res){

    const myId = req.user.id;
    const {id:recipientId} = req.params;

    try{
    if(myId === recipientId){
        return res.status(400).json({ message: "You cannot send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if(!recipient){
        return res.status(404).json({ message: "Recipient user not found" });
    }

    // chekk if user is already friends
    if(recipient.friends.includes(myId)){
        return res.status(400).json({ message: "You are already friends with this user" });
    }

    //check if request is already exists
    const existingRequest = await recipient.friendRequest.findOne({
        $or:[
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId }
        ]
    });

    if(existingRequest){
        return res.status(400).json({ message: "Friend request already exists" });
    }

    // create friend request
    const friendRequest = {
        sender: myId,
        recipient: recipientId,    
    }
    res.status(200).json({ message: "Friend request sent successfully" });
    }catch(error){
        console.log("Error in sendFriendRequest controller",error.message);
        res.status(500).json({ message: "internal server Error" });
    }
}