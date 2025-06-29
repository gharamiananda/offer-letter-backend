import { Schema } from "mongoose";

export enum offerLetterStatus {
  DRAFT = "draft",
  SENT = "send",
  FAILED = "failed",
}
export interface IPaySlip extends Document {
  employeeName: string;
  employeeId: string;
  month: number;
  year: number;
  employeeDesignation: string;
  employeeDepartment: string;
  employeeUAN: number;
  employeeESINO: number;
  basicSalary: number;
  houseRentAllowance: number;
  conveyanceAllowance: number;
  training: number;
  grossSalary: number;
  netPay: number;
  salaryOfEmployee: number;
  totalWorkingDays: number;
  totalPresentDays: number;
  totalAbsent: number;
  uninformedLeaves: number;
  halfDay: number;
  calculatedSalary: number;
  EPF: number;
  ESI: string;
  professionalTax: number;
  totalDeductions: number;
  employeeEmail: string;
  companyName: string;
  dateOfPayment: string;
  generateByUser: Schema.Types.ObjectId;
  status: offerLetterStatus;
}
