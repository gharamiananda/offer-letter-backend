"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const experience_letter_interface_1 = require("./experience-letter.interface");
const experienceLetterSchema = new mongoose_1.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    employeeEmail: {
        type: String,
        required: true,
    },
    employeeAddress: {
        type: String,
        default: "",
    },
    employeeDesignation: {
        type: String,
        default: "",
    },
    employeeDateOfJoin: {
        type: String,
        default: "",
    },
    companyName: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: experience_letter_interface_1.IEmailStatus,
        default: experience_letter_interface_1.IEmailStatus.DRAFT,
    },
    companyAddress: {
        type: String,
        default: "",
    },
    employeeDateOfResign: {
        type: String,
        default: "",
    },
    emailSubject: {
        type: String,
        default: "",
    },
    emailMessage: {
        type: String,
        default: "",
    },
    generateByUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const ExperienceLetter = (0, mongoose_1.model)("ExperienceLetter", experienceLetterSchema);
exports.default = ExperienceLetter;
