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
exports.offerLetterService = void 0;
const http_status_codes_1 = require("http-status-codes");
const p_limit_1 = __importDefault(require("p-limit"));
const uuid_1 = require("uuid");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const emailHelper_1 = require("../../utils/emailHelper");
const generateOrderInvoicePDF_1 = require("../../utils/generateOrderInvoicePDF");
const offer_letter_1 = require("../../utils/offer-letter");
const release_letter_interface_1 = require("../release-letter/release-letter.interface");
const offer_letter_model_1 = __importDefault(require("./offer-letter.model"));
const processStatuses = new Map();
const limit = (0, p_limit_1.default)(1); // Max 10 concurrent emails
exports.offerLetterService = {
    getOfferLetterAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetterQuery = new QueryBuilder_1.default(offer_letter_model_1.default.find(), query)
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
    getOfferLetterById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offerLetter = yield offer_letter_model_1.default.findById(id);
            if (!offerLetter) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offer letter not found!");
            }
            const logoBase64 = ""; // you can fetch actual logo if needed
            const htmlContent = (0, generateOrderInvoicePDF_1.generateOfferLetterHTML)(offerLetter, logoBase64);
            return htmlContent;
        });
    },
    acknowledgeById(employeeEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the offer letter exists and its current acknowledge status
            const offerLetter = yield offer_letter_model_1.default.findOne({ employeeEmail });
            if (!offerLetter) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offer letter not found!");
            }
            if (offerLetter.acknowledge) {
                return {
                    message: `Offer letter already acknowledged on ${offerLetter.dateOfAcknowledge
                        ? offerLetter.dateOfAcknowledge.toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "unknown date"}`,
                };
            }
            // Update acknowledge to true
            offerLetter.acknowledge = true;
            offerLetter.dateOfAcknowledge = new Date();
            yield offerLetter.save();
            return {
                message: "Thank you for your confirmation. Your acknowledgement has been recorded successfully.",
            };
        });
    },
    createOfferLetter(offerLetterData, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign({}, offerLetterData);
            if ((offerLetterData.status = release_letter_interface_1.IEmailStatus.SENT)) {
                const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
                const pdfBuffer = yield (0, offer_letter_1.generateOfferLetterPDFByPdfKIt)(offerLetterData);
                const attachment = {
                    filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                    content: pdfBuffer,
                    encoding: "base64", // if necessary
                };
                const result = yield emailHelper_1.EmailHelper.sendEmail(
                //@ts-ignore
                offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
                if (result.status === release_letter_interface_1.IEmailStatus.SENT) {
                    updatedData.status = release_letter_interface_1.IEmailStatus.SENT;
                }
                else {
                    updatedData.status = release_letter_interface_1.IEmailStatus.FAILED;
                }
            }
            const newOfferLetter = new offer_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
            const result = yield newOfferLetter.save();
            return result;
        });
    },
    createBulkOfferLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(offerLetters.map((data) => limit(() => this.processOneOfferLetter(data, authUser))));
            return results;
        });
    },
    // Async processing function
    processOfferLettersAsync(offerLetters, authUser, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = processStatuses.get(processId);
            if (!status)
                return;
            // Update status to processing
            status.status = "PROCESSING";
            try {
                console.log(processStatuses, processId, status, "dshgfh");
                const results = yield Promise.all(offerLetters.map((data) => limit(() => this.processOneOfferLetterWithSocket(data, authUser, processId))));
                console.log(`Bulk process ${processId} completed with ${results.length} results`);
            }
            catch (error) {
                console.error("Bulk process failed:", error);
                const errorStatus = processStatuses.get(processId);
                if (errorStatus) {
                    errorStatus.status = "FAILED";
                }
            }
        });
    },
    // New socket-enabled bulk function
    createBulkOfferLettersWithSocket(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const processId = (0, uuid_1.v4)();
            const total = offerLetters.length;
            // Initialize process status
            const initialStatus = {
                processId,
                total,
                sent: 0,
                failed: 0,
                pending: total,
                status: "PENDING",
                completedEmails: [],
                failedEmails: [],
            };
            processStatuses.set(processId, initialStatus);
            // Start processing asynchronously (don't await)
            this.processOfferLettersAsync(offerLetters, authUser, processId).catch((error) => {
                console.error(`Process ${processId} failed:`, error);
                const errorStatus = processStatuses.get(processId);
                if (errorStatus) {
                    errorStatus.status = "FAILED";
                }
            });
            return { processId, status: "started" };
        });
    },
    processOneOfferLetter(offerLetterData, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign({}, offerLetterData);
            let resultStatus = release_letter_interface_1.IEmailStatus.FAILED;
            try {
                const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
                const pdfBuffer = yield (0, offer_letter_1.generateOfferLetterPDFByPdfKIt)(offerLetterData);
                const attachment = {
                    filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                    content: pdfBuffer,
                    encoding: "base64", // if necessary
                };
                const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
                //@ts-ignore
                offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
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
            const newOfferLetter = new offer_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
            yield newOfferLetter.save();
            return {
                email: offerLetterData.employeeEmail,
                status: updatedData.status,
            };
        });
    },
    processOneOfferLetterProcessId(offerLetterData, authUser, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign({}, offerLetterData);
            let resultStatus = release_letter_interface_1.IEmailStatus.FAILED;
            try {
                // await new Promise((res) => setTimeout(res, 1000));
                const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
                const pdfBuffer = yield (0, offer_letter_1.generateOfferLetterPDFByPdfKIt)(offerLetterData);
                const attachment = {
                    filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                    content: pdfBuffer,
                    encoding: "base64", // if necessary
                };
                const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
                //@ts-ignore
                offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
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
            const newOfferLetter = new offer_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
            yield newOfferLetter.save();
            return {
                email: offerLetterData.employeeEmail,
                status: updatedData.status,
            };
        });
    },
    processOneOfferLetterWithSocket(offerLetterData, authUser, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("call", offerLetterData);
            const result = yield this.processOneOfferLetter(offerLetterData, authUser);
            console.log(result, "result");
            // Update process status after processing each email
            this.updateProcessStatus(processId, offerLetterData.employeeEmail, result.status);
            return result;
        });
    },
    // Helper function to update process status
    updateProcessStatus(processId, email, status) {
        const processStatus = processStatuses.get(processId);
        if (!processStatus)
            return;
        if (status === release_letter_interface_1.IEmailStatus.SENT) {
            processStatus.sent++;
            processStatus.completedEmails.push(email);
        }
        else {
            processStatus.failed++;
            processStatus.failedEmails.push(email);
        }
        processStatus.pending =
            processStatus.total - processStatus.sent - processStatus.failed;
        // Update status
        if (processStatus.pending === 0) {
            processStatus.status =
                processStatus.failed === processStatus.total ? "FAILED" : "COMPLETED";
        }
        // If process is complete, emit completion event
        if (processStatus.pending === 0) {
            // Clean up after 5 minutes
            setTimeout(() => {
                processStatuses.delete(processId);
            }, 300000);
        }
    },
    // Get process status
    getProcessStatus(processId) {
        return processStatuses.get(processId) || null;
    },
    // Get all active processes
    getAllActiveProcesses() {
        return Array.from(processStatuses.values());
    },
    // Cancel/delete a process
    cancelProcess(processId) {
        const deleted = processStatuses.delete(processId);
        return deleted;
    },
    // Clean up expired processes (call this periodically)
    cleanupExpiredProcesses() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        for (const [processId, status] of processStatuses.entries()) {
            if (status.status === "COMPLETED" || status.status === "FAILED") {
                // Check if process is older than maxAge (you'd need to add timestamp to status)
                // For now, just clean up completed processes after some time
                if (processStatuses.size > 100) {
                    // Prevent memory bloat
                    processStatuses.delete(processId);
                }
            }
        }
    },
};
