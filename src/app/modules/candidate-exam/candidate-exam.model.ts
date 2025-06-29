import { Schema, model, Document } from "mongoose";
import {
  CandidateExamStatus,
  ICandidateExamModel,
} from "./candidate-exam.interface";

const candidateExamSchema = new Schema<ICandidateExamModel>({
  candidateName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emergencyContactNumber: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  cv: { type: String, default: "" },
  examBy: { type: String, default: "" },
  referredBy: { type: String, default: "" },
  status: {
    type: String,
    enum: CandidateExamStatus,
    default: CandidateExamStatus.PENDING,
  },
});

const candidateExamModel = model<ICandidateExamModel>(
  "CandidateExam",
  candidateExamSchema
);

export default candidateExamModel;
