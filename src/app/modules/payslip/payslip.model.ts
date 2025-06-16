import { Schema, model, Document } from "mongoose";
import { IPaySlip } from "./payslip.interface";
const PaySlipSchema = new Schema<IPaySlip>(
  {
    employeeName: { type: String, required: true },
    employeeId: { type: String, required: true },
    employeeDesignation: { type: String, required: true },
    employeeDepartment: { type: String, required: true },
    employeeUAN: { type: Number, required: true },
    employeeESINO: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    houseRentAllowance: { type: Number, required: true },
    conveyanceAllowance: { type: Number, required: true },
    training: { type: Number, required: true },
    grossSalary: { type: Number, required: true },
    netPay: { type: Number, required: true },
    salaryOfEmployee: { type: Number, required: true },
    totalWorkingDays: { type: Number, required: true },
    totalPresentDays: { type: Number, required: true },
    totalAbsent: { type: Number, required: true },
    uninformedLeaves: { type: Number, required: true },
    halfDay: { type: Number, required: true },
    calculatedSalary: { type: Number, required: true },
    EPF: { type: Number, required: true },
    ESI: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    professionalTax: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    employeeEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    dateOfPayment: { type: String, required: true },
    generateByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PaySlip = model<IPaySlip>("PaySlip", PaySlipSchema);

export default PaySlip;
