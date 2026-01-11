import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    // array of objects with referencing the other User(friend)
    friends: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }   
    ]
},{
    timestamps: true
}) 

// save user with hashed password - pre save hook

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    try {
         const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);     
        next();
    } catch (error) {
        next(error);
    }
})

// check password in database for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatched = await bcrypt.compare(enteredPassword,this.password);
    return isPasswordMatched;
}


const User = mongoose.model("User", userSchema);

export default User;