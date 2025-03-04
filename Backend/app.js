import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import userRouter from "./Routes/user.routes.js";
import criminalRouter from './Routes/criminal.routes.js';
import { authenticateUser } from "./Middlewares/auth.middleware.js";
import searchRouter from "./Routes/search.routes.js";

const app = express();

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://fuzzy-search-eight.vercel.app'
  ], // Replace with your frontend domain or use '*' for allowing all
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/criminal/", criminalRouter);
app.use("/api/v1/search", searchRouter);

export { app };
