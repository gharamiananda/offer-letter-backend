"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateExamController = void 0;
const candidate_exam_service_1 = require("./candidate-exam.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
exports.candidateExamController = {
    getcandidateExamAll: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield candidate_exam_service_1.candidateExamService.getcandidateExamAll(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "candidateExam are retrieved successfully",
            meta: result.meta,
            data: result.result,
        });
    })),
    createcandidateExam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield candidate_exam_service_1.candidateExamService.createcandidateExam(req.body, req.file, req.user);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: "Offer Letter created succesfully",
                data: result,
            });
        });
    },
    getcandidateExamById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield candidate_exam_service_1.candidateExamService.getcandidateExamById(req.params.id);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: "Offer Letter retrived succesfully",
                data: result,
            });
        });
    },
    updateCandidateExamById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield candidate_exam_service_1.candidateExamService.getAndUpdatecandidateExamById(req.params.candidateId, req.body);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Offer Letter Updated succesfully",
                data: result,
            });
        });
    },
};
