import express from "express";
import {addMultipleCriminals, exportCriminalData, updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals} from "../Controllers/criminal.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";
import multer from "multer";

// Multer setup for file upload
const uploadFile = multer({ dest: 'uploads/' });
const criminalRouter = express.Router()

criminalRouter.route("/get-criminal/:id").get(getCriminal)
criminalRouter.route("/get-all-criminals").get(getAllCriminals)
criminalRouter.route("/add-criminal").post(upload.single("avatar"), addCriminal)
criminalRouter.route("/update-criminal/:id").post(updateCriminal)
criminalRouter.route("/delete-criminal/:id").post(deleteCriminal)
criminalRouter.route("/delete-criminals").post(deleteCriminals)
criminalRouter.post('/add-multiple-criminals', uploadFile.single('file'), addMultipleCriminals);
criminalRouter.get('/export-criminals', exportCriminalData);
export default criminalRouter