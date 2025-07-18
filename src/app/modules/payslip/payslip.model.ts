import { Schema, model, Document } from "mongoose";
import { IPaySlip } from "./payslip.interface";
import { IEmailStatus } from "../release-letter/release-letter.interface";
const PaySlipSchema = new Schema<IPaySlip>(
  {
    employeeName: { type: String, required: true },
    employeeId: { type: String, default: "" },
    employeeDesignation: { type: String, default: "" },
    employeeDepartment: { type: String, default: "" },
    employeeUAN: { type: String, default: "0" },
    employeeESINO: { type: String, default: "0" },
    basicSalary: { type: String, default: "0" },
    houseRentAllowance: { type: String, default: "0" },
    conveyanceAllowance: { type: String, default: "0" },
    training: { type: String, default: "0" },
    grossSalary: { type: String, default: "0" },
    netPay: { type: String, default: "0" },
    salaryOfEmployee: { type: String, default: "0" },
    totalWorkingDays: { type: String, default: "0" },
    totalPresentDays: { type: String, default: "0" },
    totalAbsent: { type: String, default: "0" },
    uninformedLeaves: { type: String, default: "0" },
    halfDay: { type: String, default: "0" },
    calculatedSalary: { type: String, default: "0" },
    EPF: { type: String, default: "0" },
    ESI: { type: String, default: "0" },
    month: { type: String, default: "0" },
    incentives: { type: String, default: "0" },
    OT: { type: String, default: "0" },
    year: { type: String, default: "2025" },
    professionalTax: { type: String, default: "0" },
    totalDeductions: { type: String, default: "0" },
    employeeEmail: { type: String, default: "" },
    companyName: { type: String, default: "" },
    dateOfPayment: { type: String, default: "" },
    generateByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,

      enum: IEmailStatus,
      default: IEmailStatus.DRAFT,
    },
  },
  { timestamps: true }
);

const PaySlip = model<IPaySlip>("PaySlip", PaySlipSchema);

export default PaySlip;
