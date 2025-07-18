import { Schema, model, Document } from "mongoose";
import { IEmailStatus, IExperienceLetter } from "./experience-letter.interface";

const experienceLetterSchema = new Schema<IExperienceLetter>(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    employeeAddress: {
      type: String,
      default: "",
    },
    employeeDesignation: {
      type: String,
      default: "",
    },
    employeeDateOfJoin: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    status: {
      type: String,

      enum: IEmailStatus,
      default: IEmailStatus.DRAFT,
    },
    companyAddress: {
      type: String,
      default: "",
    },
    employeeDateOfResign: {
      type: String,
      default: "",
    },
    emailSubject: {
      type: String,
      default: "",
    },
    emailMessage: {
      type: String,
      default: "",
    },
    generateByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ExperienceLetter = model<IExperienceLetter>(
  "ExperienceLetter",
  experienceLetterSchema
);

export default ExperienceLetter;
