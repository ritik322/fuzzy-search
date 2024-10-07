import express from "express";
import { registerUser } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";

const userRouter = express.Router()

userRouter.route("/register-user").post(upload.single("avatar"), registerUser);

export default userRouter