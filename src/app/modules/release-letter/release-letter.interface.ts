import { Schema } from "mongoose";

export enum IEmailStatus {
  DRAFT = "draft",
  SENT = "send",
  FAILED = "failed",
}
export interface IReleaseLetter extends Document {
  employeeName: string;
  employeeEmail: string;
  employeeGender: "Male" | "Female" | "Other";
  employeeAddress: string;
  employeeDesignation: string;
  employeeDateOfJoin: string;
  employeeDateOfResign: string;
  companyName: string;
  companyAddress: string;
  emailSubject: string;
  emailMessage: string;
  status: IEmailStatus;
  generateByUser: Schema.Types.ObjectId;
}
