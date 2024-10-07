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
  },
  { timestamps: true }
);

export const Criminal = mongoose.model("Criminal", criminalSchema);
