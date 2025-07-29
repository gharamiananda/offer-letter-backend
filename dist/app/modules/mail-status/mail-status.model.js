"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailStatus = void 0;
const mongoose_1 = require("mongoose");
const mailStatusSchema = new mongoose_1.Schema({
    processId: {
        type: String,
        required: true,
        unique: true,
    },
    completedEmails: [
        {
            type: String,
            required: true,
        },
    ],
    failedEmails: [
        {
            type: String,
            required: true,
        },
    ],
    mailType: {
        type: String,
        enum: ["OFFERLETTER", "PAYSLIP", "EXPERIENCE"],
        default: "OFFERLETTER",
    },
    status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
        default: "PROCESSING",
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    failed: {
        type: Number,
        default: 0,
        min: 0,
    },
    pending: {
        type: Number,
        default: null,
        min: 0,
    },
}, {
    timestamps: true,
});
exports.MailStatus = (0, mongoose_1.model)("MailStatus", mailStatusSchema);
