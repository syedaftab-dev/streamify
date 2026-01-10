import User from "../model/User.js";
import jwt from "jsonwebtoken"
import {upsertStreamChat} from "../lib/stream.js"

export async function signup(req,res){
    const {email,password,fullName} = req.body;
    try {
        // check if we user has enter email,name and password or not
        if(!email || !password || !fullName){
            return res.status(400).json({ message: "All fields are required! "});
        }

        //if password iis short ie  <6
        if(password.length<6){
            return res.status(400).json({ message: "Password must be at least 6 characters"});
        }

        // check for email validation, ex: jonh@  ,aftab@gmail ,
        // copy this regression equation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if not valid email
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // check if user already existed 
        const isAlreadyExist = await User.findOne({email});
        
        if(isAlreadyExist){
            return res.status(400).json({ message: "Email already exists please use a different one" });
        }

        // lets generate a number b/w 1-100 to get a avatar/profile pic from an API
        const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000) + 1}`;
        // create a new user
        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar
        });
        
        // TODO: CREATE THE USER IN STREAM AS WELL
       try {
            await upsertStreamChat({
                id:newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
        });
        console.log(`Stream user created for ${newUser.fullName}`);
       } catch (error) {
            console.log("error created stream user",error);
       }

        // make jwt token
        const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{expiresIn: "7d"});

        // send in cokies to userjd
        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpsOnly: true, // prevent XSS attack
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })  
        // new resources created
        res.status(201).json({
            success: true,
            user: newUser
        })
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req,res){
    const {email,password} = req.body;

    try {
        if(!email || !password){
        return res.status(400).json({ message : "All fields are required"})
    }   

    const user = await User.findOne({email});
    // if user doesn't exist
    if(!user){ 
        return res.status(401).json({ message: "invalid email or password" })
    }
    const isPasswordCorrect = await user.matchPassword(password);

    // password is not matched
    if(!isPasswordCorrect){
        return res.status(401).json({ message: "Invalid email or password"});
    }
    // create a token if email and passo=word is correct
    // make jwt token
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    // send in cookies to user
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attack
        sameSite: "strict", // prevent CSRF attacks
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        success: true,
        user
    });
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({ message: "internal server Error" });
    }
}   


export async function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({ success: true, message: "Logout succesfully"});

}

// to update the profile before that if will verify the jwt token for access(protectRoute)
export async function isOnboarding(req,res){
    try {
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All Fields are required!",
                missingFields: [ 
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location "
                ].filter(Boolean),
            },)
        }
        // update the user data in database with the new data
        const userUpdated = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnBoarded: true,
            },
            {
                new: true  // makes this function to return updated user ie userUpdated
            }
        );

        // check if userUpdate is null
        if(!userUpdated){
            return res.status(404).json({ message: "User not found"});
        }
        
        // TODO : update user in stream also
       
        try {
            await upsertStreamChat({
                id: userUpdated._id.toString(),
                name: userUpdated.fullName,
                image: userUpdated.profilePic  || ""
            })
            console.log("Stream user updated after onboarding for",userUpdated.fullName);
        } catch (streamError) {
            console.log("Error updating stream user dring onboarding",streamError.message);
        }

        
        res.status(200).json({success: true, user: userUpdated});

    } catch (error) {
        console.log("Onboarding error:",error);
        res.status(500).json({message: "Internal Server Error"})
    }
}