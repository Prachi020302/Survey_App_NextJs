import mongoose from "mongoose";

export interface IField {
  id: string;
  label: string;
  type: "text" | "number" | "checkbox" | "select" | "radio";
  options?: string[];
}

export interface ISurvey extends Document {
  id: string;
  title: string;
  description?: string;
  questions: IField[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId; // User ID
}
