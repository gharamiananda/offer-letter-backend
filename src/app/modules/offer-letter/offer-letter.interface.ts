import { Schema } from "mongoose";
import { IEmailStatus } from "../release-letter/release-letter.interface";

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
  status: IEmailStatus;
  generateByUser: Schema.Types.ObjectId;
  acknowledge: boolean;
  dateOfAcknowledge: Date;
}
