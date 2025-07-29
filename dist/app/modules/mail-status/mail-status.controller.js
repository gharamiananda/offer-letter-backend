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
exports.sentMailStatusController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const mail_status_service_1 = require("./mail-status.service");
const createSentMailStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mail_status_service_1.SentMailStatusService.createSentMailStatus(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Mail status created successfully",
        data: result,
    });
}));
const getAllSentMailStatuses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mail_status_service_1.SentMailStatusService.getAllMailStatuses(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Mail statuses fetched successfully",
        data: result,
    });
}));
const updateSentMailStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { processId } = req.params;
    const result = yield mail_status_service_1.SentMailStatusService.updateMailStatus(processId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Mail status updated successfully",
        data: result,
    });
}));
const getSentMailStatusByProcessId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { processId } = req.params;
    const result = yield mail_status_service_1.SentMailStatusService.getMailStatusByProcessId(processId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Mail status fetched successfully",
        data: result,
    });
}));
const deleteSentMailStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { processId } = req.params;
    const result = yield mail_status_service_1.SentMailStatusService.deleteMailStatus(processId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.sentMailStatusController = {
    createSentMailStatus,
    getAllSentMailStatuses,
    updateSentMailStatus,
    getSentMailStatusByProcessId,
    deleteSentMailStatus,
};
