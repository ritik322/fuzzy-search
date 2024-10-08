import express from "express";
import { deleteUser, getUser, loginUser, registerUser, updateUser } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const userRouter = express.Router()

userRouter.route("/get-user").get(authenticateUser,getUser)
userRouter.route("/register-user").post(upload.single("avatar"), registerUser);
userRouter.route("/login-user").post(upload.none(),loginUser);
userRouter.route("/update-user").post(upload.none(),authenticateUser, updateUser)
userRouter.route("/delete-user").post(upload.none(),authenticateUser, deleteUser)

export default userRouter