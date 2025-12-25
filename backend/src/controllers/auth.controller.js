import User from "../model/User";
import jwt from "jsonwebtoken"

export async function signup(req,res){
    const {email,password,fullName} = req.body();
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
        const idx = Math.floor(Math.random()*100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // create a new user
        const newUser = new User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar
        });

        // make jwt token
        const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{expiresIn: "7d"});

        // send in cokies to user
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
        
    }
}

export async function login(req,res){
    res.send("login page")

}

export async function logout(req,res){
    res.send("logout page")

}
