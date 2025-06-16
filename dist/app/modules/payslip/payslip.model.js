"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaySlipSchema = new mongoose_1.Schema({
    employeeName: { type: String, required: true },
    employeeId: { type: String, required: true },
    employeeDesignation: { type: String, required: true },
    employeeDepartment: { type: String, required: true },
    employeeUAN: { type: String, required: true },
    employeeESINO: { type: String, required: true },
    basicSalary: { type: String, required: true },
    houseRentAllowance: { type: String, required: true },
    conveyanceAllowance: { type: String, required: true },
    training: { type: String, required: true },
    grossSalary: { type: String, required: true },
    netPay: { type: String, required: true },
    salaryOfEmployee: { type: String, required: true },
    totalWorkingDays: { type: String, required: true },
    totalPresentDays: { type: String, required: true },
    totalAbsent: { type: String, required: true },
    uninformedLeaves: { type: String, required: true },
    halfDay: { type: String, required: true },
    calculatedSalary: { type: String, required: true },
    EPF: { type: String, required: true },
    ESI: { type: String, required: true },
    professionalTax: { type: String, required: true },
    totalDeductions: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    dateOfPayment: { type: String, required: true },
    generateByUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const PaySlip = (0, mongoose_1.model)("PaySlip", PaySlipSchema);
exports.default = PaySlip;
