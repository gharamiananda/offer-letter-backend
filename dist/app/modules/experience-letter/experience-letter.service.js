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
exports.experienceLetterService = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const emailHelper_1 = require("../../utils/emailHelper");
const experience_letter_interface_1 = require("./experience-letter.interface");
const experience_letter_model_1 = __importDefault(require("./experience-letter.model"));
const experience_letter_1 = require("../../utils/woodrock/experience-letter");
const limit = (0, p_limit_1.default)(10); // Max 10 concurrent emails
function processOneExperienceLetter(offerLetterData, authUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedData = Object.assign({}, offerLetterData);
        let resultStatus = experience_letter_interface_1.IEmailStatus.FAILED;
        try {
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "experienceLetter");
            const pdfBuffer = yield (0, experience_letter_1.generateExperienceLetterPDF)(offerLetterData);
            const attachment = {
                filename: `experienceLetter_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64", // if necessary
            };
            const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "Experience letter!", attachment);
            resultStatus =
                emailResult.status === experience_letter_interface_1.IEmailStatus.SENT
                    ? experience_letter_interface_1.IEmailStatus.SENT
                    : experience_letter_interface_1.IEmailStatus.FAILED;
            updatedData.status = resultStatus;
        }
        catch (error) {
            console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
            updatedData.status = experience_letter_interface_1.IEmailStatus.FAILED;
        }
        const newOfferLetter = new experience_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
        yield newOfferLetter.save();
        return {
            email: offerLetterData.employeeEmail,
            status: updatedData.status,
        };
    });
}
exports.experienceLetterService = {
    getExperienceLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(experience_letter_model_1.default.find(), query)
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
    createBulkExperienceLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(offerLetters.map((data) => limit(() => processOneExperienceLetter(data, authUser))));
            return results;
        });
    },
};
