import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import { connectDB } from "./lib/db.js"
import chatRoutes from "./routes/chat.route.js"
import cors from "cors"

const app = express()
const port = process.env.PORT || 5001;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend cookies to be sent
}));


app.use(express.json()) // 2 read data inside the req body
app.use(cookieParser())

// route for authentication
app.use("/api/auth", authRoutes);

// router for users
app.use("/api/users",userRoutes);

// for chat and video calling we will add later
app.use("/api/chat",chatRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB();
}) 