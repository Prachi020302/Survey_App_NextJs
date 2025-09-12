import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IField, ISurvey } from "../types/Survey";

const FieldSchema = new mongoose.Schema<IField>(
  {
    id: { type: String, default: uuidv4, unique: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    options: [String],
  },
  { _id: false }
);

const SurveySchema = new mongoose.Schema<ISurvey>(
  {
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [FieldSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Survey_Data =
  mongoose.models.Survey_Data || mongoose.model("Survey_Data", SurveySchema);

export { Survey_Data };
