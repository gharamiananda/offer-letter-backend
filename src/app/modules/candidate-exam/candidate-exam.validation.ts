import { z } from "zod";

export const candidateExamValidation = {
  create: z.object({
    name: z.string().min(1, "Name is required"),
  }),
  update: z.object({
    id: z.string().uuid("Invalid ID format"),
    name: z.string().optional(),
  }),
};
