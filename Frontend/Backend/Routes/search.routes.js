import express from "express";
import { search } from "../Controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.route("/").post(search)

export default searchRouter