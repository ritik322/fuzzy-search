import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.routes.js";
im

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/v1/user/",userRouter)
app.use("/api/v1/criminal/", criminalRouter);




export {app}