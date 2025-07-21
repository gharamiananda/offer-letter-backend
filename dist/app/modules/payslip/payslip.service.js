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
exports.payslipService = void 0;
const http_status_codes_1 = require("http-status-codes");
const p_limit_1 = __importDefault(require("p-limit"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const emailHelper_1 = require("../../utils/emailHelper");
const generateOrderInvoicePDF_1 = require("../../utils/generateOrderInvoicePDF");
const payslip_model_1 = __importDefault(require("./payslip.model"));
const release_letter_interface_1 = require("../release-letter/release-letter.interface");
const limit = (0, p_limit_1.default)(10); // Max 10 concurrent emails
function processOneOfferLetter(offerLetterData, authUser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, offerLetterData), "payslip");
            const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generatePayslipPDF)(offerLetterData);
            const attachment = {
                filename: `payslip_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64",
            };
            const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "Payslip generated!", attachment);
            const resultStatus = emailResult.status === release_letter_interface_1.IEmailStatus.SENT
                ? release_letter_interface_1.IEmailStatus.SENT
                : release_letter_interface_1.IEmailStatus.FAILED;
            const newOfferLetter = new payslip_model_1.default(Object.assign(Object.assign({}, offerLetterData), { generateByUser: authUser.userId, status: resultStatus }));
            const result = yield newOfferLetter.save();
            return result;
        }
        catch (error) {
            console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
        }
        const newOfferLetter = new payslip_model_1.default(Object.assign(Object.assign({}, offerLetterData), { generateByUser: authUser.userId }));
        yield newOfferLetter.save();
        return {
            email: offerLetterData.employeeEmail,
        };
    });
}
exports.payslipService = {
    getOfferLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(payslip_model_1.default.find(), query)
                .search(["employeeName", "employeeEmail"])
                .filter()
                .sort()
                .paginate()
                .fields();
            const result = yield offerLetterQuery.modelQuery;
            const meta = yield offerLetterQuery.countTotal();
            return {
                meta,
                result,
            };
        });
    },
    getThisMonthPayslipCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
            const currentMonthCount = yield payslip_model_1.default.countDocuments({
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            });
            return {
                currentMonthCount, // add this to the response
            };
        });
    },
    getOfferLetterById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetter = yield payslip_model_1.default.findById(id);
            if (!offerLetter) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offer letter not found!");
            }
            const htmlContent = (0, generateOrderInvoicePDF_1.generatePayslipPDF)(offerLetter);
            return htmlContent;
        });
    },
    createOfferLetter(offerLetterData, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign({}, offerLetterData);
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
            const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generatePayslipPDF)(offerLetterData);
            const attachment = {
                filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64", // if necessary
            };
            yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
            const newOfferLetter = new payslip_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
            const result = yield newOfferLetter.save();
            return result;
        });
    },
    createBulkOfferLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(offerLetters.map((data) => limit(() => {
                if (data === null || data === void 0 ? void 0 : data.employeeEmail) {
                    return processOneOfferLetter(data, authUser);
                }
                return;
            })));
            return results;
        });
    },
};
