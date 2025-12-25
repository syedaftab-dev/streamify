import express from "express"
import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"

const app = express()
const port = process.env.PORT || 5001;
app.use(express.json()) // 2 read data inside the req body

app.use("/api/auth", authRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB();
})