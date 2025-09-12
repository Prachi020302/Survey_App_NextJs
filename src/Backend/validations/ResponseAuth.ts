import { z } from "zod";

// Answer schema
const AnswerSchema = z.object({
  questionId: z.string(),
  selectedOptions: z.array(z.string()).optional(), // optional or required? adjust as needed
});

// Response schema
export const ResponseSchema = z.object({
  surveyId: z.string(),
  userId: z.string().optional(), // userId is optional in Mongoose too
  answers: z.array(AnswerSchema).min(1),
  submittedAt: z.date().default(() => new Date()),
});

export type ResponseType = z.infer<typeof ResponseSchema>;