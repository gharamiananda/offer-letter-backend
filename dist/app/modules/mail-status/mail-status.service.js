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
exports.SentMailStatusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mail_status_model_1 = require("./mail-status.model");
const createSentMailStatus = (statusData) => __awaiter(void 0, void 0, void 0, function* () {
    const status = new mail_status_model_1.MailStatus(Object.assign(Object.assign({}, statusData), { status: "PENDING", completedEmails: [], failedEmails: [] }));
    return yield status.save();
});
const getAllMailStatuses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(mail_status_model_1.MailStatus.find(), query)
        .search(["processId", "mailType"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return { meta, result };
});
const updateMailStatus = (processId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield mail_status_model_1.MailStatus.findOne({ processId });
    if (!status) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mail process not found.");
    }
    const updated = yield mail_status_model_1.MailStatus.findByIdAndUpdate(status._id, { $set: payload }, { new: true, runValidators: true });
    return updated;
});
const getMailStatusByProcessId = (processId) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield mail_status_model_1.MailStatus.findOne({ processId });
    if (!status) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mail status not found.");
    }
    return status;
});
const deleteMailStatus = (processId) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield mail_status_model_1.MailStatus.findOne({ processId });
    if (!status) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mail status not found.");
    }
    yield mail_status_model_1.MailStatus.updateOne({ _id: status._id }, { isDeleted: true });
    return { message: "Mail status deleted successfully." };
});
exports.SentMailStatusService = {
    createSentMailStatus,
    getAllMailStatuses,
    updateMailStatus,
    getMailStatusByProcessId,
    deleteMailStatus,
};
