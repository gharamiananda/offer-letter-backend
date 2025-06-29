"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const payslip_interface_1 = require("./payslip.interface");
const PaySlipSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: payslip_interface_1.offerLetterStatus,
        default: payslip_interface_1.offerLetterStatus.DRAFT,
    },
}, { timestamps: true });
const PaySlip = (0, mongoose_1.model)("PaySlip", PaySlipSchema);
exports.default = PaySlip;
