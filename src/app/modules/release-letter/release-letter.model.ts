import { Schema, model, Document } from "mongoose";
import { IEmailStatus, IReleaseLetter } from "./release-letter.interface";

const releaseLetterSchema = new Schema<IReleaseLetter>(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    employeeGender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
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

const ReleaseLetter = model<IReleaseLetter>(
  "ReleaseLetter",
  releaseLetterSchema
);

export default ReleaseLetter;
