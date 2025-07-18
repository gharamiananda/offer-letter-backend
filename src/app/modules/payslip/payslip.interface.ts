import { Schema } from "mongoose";
import { IEmailStatus } from "../release-letter/release-letter.interface";

export interface IPaySlip extends Document {
  employeeName: string;
  employeeId: string;
  month: string;
  year: string;
  employeeDesignation: string;
  employeeDepartment: string;
  employeeUAN: string;
  employeeESINO: string;
  basicSalary: string;
  houseRentAllowance: string;
  conveyanceAllowance: string;
  training: string;
  grossSalary: string;
  netPay: string;
  salaryOfEmployee: string;
  totalWorkingDays: string;
  totalPresentDays: string;
  totalAbsent: string;
  uninformedLeaves: string;
  halfDay: string;
  calculatedSalary: string;
  EPF: string;
  ESI: string;
  incentives: string;
  OT: string;
  professionalTax: string;
  totalDeductions: string;
  employeeEmail: string;
  companyName: string;
  dateOfPayment: string;
  generateByUser: Schema.Types.ObjectId;
  status: IEmailStatus;
}
