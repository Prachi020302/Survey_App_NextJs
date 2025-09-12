import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true }, // Changed from ObjectId to String to match field ID
    selectedOptions: [{ type: String }],
  },
  { _id: false }
);

const ResponseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    surveyId: {
      type: String,
      ref: "Survey_Data",
      required: true,
    },
    userId: { type: String, ref: "User_Data" },
    answers: [answerSchema],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Response_Data =
  mongoose.models.Response_Data ||
  mongoose.model("Response_Data", ResponseSchema);

export { Response_Data };
