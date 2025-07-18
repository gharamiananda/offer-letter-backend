import { Schema } from "mongoose";

export enum IEmailStatus {
  DRAFT = "draft",
  SENT = "send",
  FAILED = "failed",
}
export interface IExperienceLetter extends Document {
  employeeName: string;
  employeeEmail: string;
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
