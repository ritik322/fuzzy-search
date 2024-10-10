import express from "express";
import {addMultipleCriminals, exportCriminalData, updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals, getAllLogs} from "../Controllers/criminal.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";
import multer from "multer";

// Multer setup for file upload
const uploadFile = multer({ dest: 'uploads/' });
const criminalRouter = express.Router()

criminalRouter.route("/get-criminal/:id").get(getCriminal)
criminalRouter.route("/get-all-criminals").get(getAllCriminals)
criminalRouter.route("/add-criminal").post(upload.single("photo"), addCriminal)
criminalRouter.route("/update-criminal/:id").post(updateCriminal)
criminalRouter.route("/delete-criminal/:id").post(deleteCriminal)
criminalRouter.route("/delete-criminals").post(deleteCriminals)
criminalRouter.route('/add-multiple-criminals').post(uploadFile.single('file'), addMultipleCriminals);
criminalRouter.route('/export-criminals').get(exportCriminalData);
criminalRouter.route('/get-all-logs').get(getAllLogs);
export default criminalRouter