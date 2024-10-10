import mongoose from "mongoose";

const criminalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: String,
    inCustody: Boolean,
    age: Number,
    description: String,
    gender: String,
    location: String,
    crime: [String],
    reviewStatus: { type: String, enum: ['under review', 'cleared'], default: 'cleared' },
    matchPercentage: Number, // For similarity percentage
    matchedRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criminal"
    }, // To indicate which field matched, e.g., 'name', 'age'
  },
  { timestamps: true }
);

export const Criminal = mongoose.model("Criminal", criminalSchema);
