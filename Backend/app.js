import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.routes.js";
import criminalRouter from './Routes/criminal.routes.js';
import { authenticateUser } from "./Middlewares/auth.middleware.js";
import searchRouter from "./Routes/search.route.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/v1/user/",userRouter)
app.use("/api/v1/criminal/",authenticateUser, criminalRouter);
app.use("/api/v1/search",searchRouter)


export {app}