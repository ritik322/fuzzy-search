import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true, // 'create', 'update', 'delete'
  },
  criminalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criminal", // Reference the Criminal model
  },
  details: {
    type: String, // Additional details about the changes made
  },
  iv: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically add the current timestamp
  },
});

export const Log = mongoose.model("Log", logSchema);
