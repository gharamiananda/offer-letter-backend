import { Schema, model, Document } from "mongoose";
import { IPaySlip, offerLetterStatus } from "./payslip.interface";
const PaySlipSchema = new Schema<IPaySlip>(
  {
    employeeName: { type: String, required: true },
    employeeId: { type: String, default: "" },
    employeeDesignation: { type: String, default: "" },
    employeeDepartment: { type: String, default: "" },
    employeeUAN: { type: Number, default: 0 },
    employeeESINO: { type: Number, default: 0 },
    basicSalary: { type: Number, default: 0 },
    houseRentAllowance: { type: Number, default: 0 },
    conveyanceAllowance: { type: Number, default: 0 },
    training: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    salaryOfEmployee: { type: Number, default: 0 },
    totalWorkingDays: { type: Number, default: 0 },
    totalPresentDays: { type: Number, default: 0 },
    totalAbsent: { type: Number, default: 0 },
    uninformedLeaves: { type: Number, default: 0 },
    halfDay: { type: Number, default: 0 },
    calculatedSalary: { type: Number, default: 0 },
    EPF: { type: Number, default: 0 },
    ESI: { type: String, default: "" },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 2025 },
    professionalTax: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    employeeEmail: { type: String, default: "" },
    companyName: { type: String, default: "" },
    dateOfPayment: { type: String, default: "" },
    generateByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,

      enum: offerLetterStatus,
      default: offerLetterStatus.DRAFT,
    },
  },
  { timestamps: true }
);

const PaySlip = model<IPaySlip>("PaySlip", PaySlipSchema);

export default PaySlip;
