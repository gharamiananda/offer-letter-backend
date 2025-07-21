"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const release_letter_interface_1 = require("../release-letter/release-letter.interface");
const offerLetterSchema = new mongoose_1.Schema({
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
    employeeCtc: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
        default: "",
    },
    companyName: {
        type: String,
        default: "",
    },
    acknowledge: {
        type: Boolean,
        default: false,
    },
    dateOfAcknowledge: {
        type: Date,
        default: null,
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
    offerLetterDate: {
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
    companyContactName: {
        type: String,
        default: "",
    },
    companyPersonTitle: {
        type: String,
        default: "",
    },
    companyContactNumber: {
        type: String,
        default: "0",
    },
    companyPersonalEmail: {
        type: String,
        default: "",
    },
    generateByUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const OfferLetter = (0, mongoose_1.model)("OfferLetter", offerLetterSchema);
exports.default = OfferLetter;
