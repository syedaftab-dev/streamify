import User from "../model/User.js";

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