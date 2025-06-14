"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const offer_letter_interface_1 = require("./offer-letter.interface");
const offerLetterSchema = new mongoose_1.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    employeeAddress: {
        type: String,
        required: true,
    },
    employeeDesignation: {
        type: String,
        required: true,
    },
    employeeDateOfJoin: {
        type: String,
        required: true,
    },
    employeeCtc: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
        default: "",
        validate: {
            validator: function (v) {
                return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/.test(v);
            },
            message: "Invalid company logo URL format.",
        },
    },
    companyName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: offer_letter_interface_1.offerLetterStatus,
        default: offer_letter_interface_1.offerLetterStatus.DRAFT,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    offerLetterDate: {
        type: String,
        required: true,
    },
    emailSubject: {
        type: String,
        required: true,
    },
    emailMessage: {
        type: String,
        required: true,
    },
    companyContactName: {
        type: String,
        required: true,
    },
    companyPersonTitle: {
        type: String,
        required: true,
    },
    companyContactNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v);
            },
            message: "Contact number must be between 10 to 15 digits.",
        },
        required: true,
    },
    companyPersonalEmail: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email format.",
        },
        required: true,
    },
    generateByUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const OfferLetter = (0, mongoose_1.model)("OfferLetter", offerLetterSchema);
exports.default = OfferLetter;
