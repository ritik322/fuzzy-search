import express from "express";
import { deleteUser, getAllUser, getUser, loginUser, logoutUser, registerUser, updateUser } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const userRouter = express.Router()

userRouter.route("/get-user/:id").get(authenticateUser,getUser)
userRouter.route("/allUsers").get(getAllUser)
userRouter.route("/register-user").post(upload.single("avatar"), registerUser);
userRouter.route("/login-user").post(upload.none(),loginUser);
userRouter.route("/update-user").post(upload.none(),authenticateUser, updateUser)
userRouter.route("/delete-user/:id").get(deleteUser)
userRouter.route("/logout").get(authenticateUser,logoutUser)

export default userRouter