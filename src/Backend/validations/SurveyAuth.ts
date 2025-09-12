import { z } from "zod";

// Field schema
const FieldSchema = z.object({
  label: z.string(),
  type: z.enum(["text", "number", "checkbox", "select", "radio"]),
  options: z.array(z.string()).optional(),
});

// Survey schema
export const SurveySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(FieldSchema).min(1),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(), // will hold ObjectId as string
});

export type SurveyType = z.infer<typeof SurveySchema>;
