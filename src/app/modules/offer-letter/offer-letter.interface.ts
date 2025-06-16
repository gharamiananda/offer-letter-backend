import { Schema } from "mongoose";

export enum offerLetterStatus {
  DRAFT = "draft",
  SENT = "send",
  FAILED = "failed",
}
export interface IOfferLetter extends Document {
  employeeName: string;
  employeeEmail: string;
  employeeAddress: string;
  employeeDesignation: string;
  employeeDateOfJoin: string;
  employeeCtc: string;
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  offerLetterDate: string;
  companyContactName: string;
  companyPersonTitle: string;
  companyContactNumber: string;
  companyPersonalEmail: string;
  emailSubject: string;
  emailMessage: string;
  status: offerLetterStatus;
  generateByUser: Schema.Types.ObjectId;
  acknowledge: boolean;
  dateOfAcknowledge: Date;
}
