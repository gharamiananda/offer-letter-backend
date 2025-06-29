"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateExamRoutes = void 0;
const express_1 = require("express");
const candidate_exam_controller_1 = require("./candidate-exam.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const multer_config_1 = require("../../config/multer.config");
const user_interface_1 = require("../user/user.interface");
const bodyParser_1 = require("../../middleware/bodyParser");
const router = (0, express_1.Router)();
router.get("/", candidate_exam_controller_1.candidateExamController.getcandidateExamAll);
router.get("/:id", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), candidate_exam_controller_1.candidateExamController.getcandidateExamById);
router.post("/", multer_config_1.multerUpload.single("cv"), bodyParser_1.parseBody, candidate_exam_controller_1.candidateExamController.createcandidateExam);
router.patch("/:candidateId", candidate_exam_controller_1.candidateExamController.updateCandidateExamById);
exports.CandidateExamRoutes = router;
