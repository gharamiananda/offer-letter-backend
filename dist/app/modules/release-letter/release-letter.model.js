"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const release_letter_interface_1 = require("./release-letter.interface");
const releaseLetterSchema = new mongoose_1.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    employeeEmail: {
        type: String,
        required: true,
    },
    employeeGender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
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
        enum: release_letter_interface_1.IEmailStatus,
        default: release_letter_interface_1.IEmailStatus.DRAFT,
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
const ReleaseLetter = (0, mongoose_1.model)("ReleaseLetter", releaseLetterSchema);
exports.default = ReleaseLetter;
