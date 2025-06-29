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
exports.candidateExamService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const candidate_exam_model_1 = __importDefault(require("./candidate-exam.model"));
exports.candidateExamService = {
    getcandidateExamAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateExamQuery = new QueryBuilder_1.default(candidate_exam_model_1.default.find(), query)
                .search(["candidateName", "candidateEmail"])
                .filter()
                .sort()
                .paginate()
                .fields();
            const result = yield candidateExamQuery.modelQuery;
            const meta = yield candidateExamQuery.countTotal();
            return {
                meta,
                result,
            };
        });
    },
    getcandidateExamById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateExam = yield candidate_exam_model_1.default.findById(id);
            if (!candidateExam) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offer letter not found!");
            }
            return candidateExam;
        });
    },
    getAndUpdatecandidateExamById(productId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_exam_model_1.default.findByIdAndUpdate(productId, payload, {
                new: true,
            });
        });
    },
    createcandidateExam(candidateExamData, file, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const newcandidateExam = new candidate_exam_model_1.default(candidateExamData);
            if (file && file.path) {
                newcandidateExam.cv = file.path;
            }
            const result = yield newcandidateExam.save();
            return result;
        });
    },
};
