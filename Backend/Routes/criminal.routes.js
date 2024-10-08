import express from "express";
import {updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals} from "../Controllers/criminal.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const userRouter = express.Router()

userRouter.route("/get-criminal/:id").get(getCriminal)
userRouter.route("/get-all-criminals").get(getAllCriminals)
userRouter.route("/add-criminal").post(upload.single("avatar"), addCriminal)
userRouter.route("/update-criminal/:id").post(updateCriminal)
userRouter.route("/delete-criminal/:id").post(deleteCriminal)
userRouter.route("/delete-criminals").post(deleteCriminals)
export default userRouter