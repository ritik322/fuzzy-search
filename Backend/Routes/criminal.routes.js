import express from "express";
import {updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals} from "../Controllers/criminal.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const criminalRouter = express.Router()

criminalRouter.route("/get-criminal/:id").get(getCriminal)
criminalRouter.route("/get-all-criminals").get(getAllCriminals)
criminalRouter.route("/add-criminal").post(upload.single("avatar"), addCriminal)
criminalRouter.route("/update-criminal/:id").post(updateCriminal)
criminalRouter.route("/delete-criminal/:id").post(deleteCriminal)
criminalRouter.route("/delete-criminals").post(deleteCriminals)

export default criminalRouter
