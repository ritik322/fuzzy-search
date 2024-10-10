// Feedback Model
import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);

