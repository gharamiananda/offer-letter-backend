import { Schema, model } from "mongoose";
import { ISentMailStatus } from "./mail-status.interface";

const mailStatusSchema = new Schema<ISentMailStatus>(
  {
    processId: {
      type: String,
      required: true,
      unique: true,
    },
    completedEmails: [
      {
        type: String,
        required: true,
      },
    ],
    failedEmails: [
      {
        type: String,
        required: true,
      },
    ],
    mailType: {
      type: String,
      enum: ["OFFERLETTER", "PAYSLIP", "EXPERIENCE"],
      default: "OFFERLETTER",
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PROCESSING",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    failed: {
      type: Number,
      default: 0,
      min: 0,
    },
    pending: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const MailStatus = model<ISentMailStatus>(
  "MailStatus",
  mailStatusSchema
);
