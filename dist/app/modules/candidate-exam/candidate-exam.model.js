"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const candidate_exam_interface_1 = require("./candidate-exam.interface");
const candidateExamSchema = new mongoose_1.Schema({
    candidateName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    cv: { type: String, default: "" },
    examBy: { type: String, default: "" },
    referredBy: { type: String, default: "" },
    status: {
        type: String,
        enum: candidate_exam_interface_1.CandidateExamStatus,
        default: candidate_exam_interface_1.CandidateExamStatus.PENDING,
    },
});
const candidateExamModel = (0, mongoose_1.model)("CandidateExam", candidateExamSchema);
exports.default = candidateExamModel;
