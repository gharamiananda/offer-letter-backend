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
exports.releaseLetterService = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const emailHelper_1 = require("../../utils/emailHelper");
const release_letter_1 = require("../../utils/woodrock/release-letter");
const release_letter_interface_1 = require("./release-letter.interface");
const release_letter_model_1 = __importDefault(require("./release-letter.model"));
const limit = (0, p_limit_1.default)(10); // Max 10 concurrent emails
function processOneReleaseLetter(offerLetterData, authUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedData = Object.assign({}, offerLetterData);
        let resultStatus = release_letter_interface_1.IEmailStatus.FAILED;
        try {
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "releaseLetter");
            const pdfBuffer = yield (0, release_letter_1.generateReleaseLetterPDF)(offerLetterData);
            const attachment = {
                filename: `releaseLetter_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64", // if necessary
            };
            const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "release letter!", attachment);
            resultStatus =
                emailResult.status === release_letter_interface_1.IEmailStatus.SENT
                    ? release_letter_interface_1.IEmailStatus.SENT
                    : release_letter_interface_1.IEmailStatus.FAILED;
            updatedData.status = resultStatus;
        }
        catch (error) {
            console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
            updatedData.status = release_letter_interface_1.IEmailStatus.FAILED;
        }
        const newOfferLetter = new release_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
        yield newOfferLetter.save();
        return {
            email: offerLetterData.employeeEmail,
            status: updatedData.status,
        };
    });
}
exports.releaseLetterService = {
    getReleaseLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(release_letter_model_1.default.find(), query)
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
    createBulkReleaseLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(offerLetters.map((data) => limit(() => processOneReleaseLetter(data, authUser))));
            return results;
        });
    },
};
