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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const emailHelper_1 = require("../../utils/emailHelper");
const generateOrderInvoicePDF_1 = require("../../utils/generateOrderInvoicePDF");
const offer_letter_interface_1 = require("./offer-letter.interface");
const offer_letter_model_1 = __importDefault(require("./offer-letter.model"));
const p_limit_1 = __importDefault(require("p-limit"));
const limit = (0, p_limit_1.default)(10); // Max 10 concurrent emails
function processOneOfferLetter(offerLetterData, authUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedData = Object.assign({}, offerLetterData);
        let resultStatus = offer_letter_interface_1.offerLetterStatus.FAILED;
        try {
            const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
            const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generateOfferLetterPDF)(offerLetterData);
            const attachment = {
                filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                content: pdfBuffer,
                encoding: "base64", // if necessary
            };
            const emailResult = yield emailHelper_1.EmailHelper.sendEmail(
            //@ts-ignore
            offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
            resultStatus =
                emailResult.status === offer_letter_interface_1.offerLetterStatus.SENT
                    ? offer_letter_interface_1.offerLetterStatus.SENT
                    : offer_letter_interface_1.offerLetterStatus.FAILED;
            updatedData.status = resultStatus;
        }
        catch (error) {
            console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
            updatedData.status = offer_letter_interface_1.offerLetterStatus.FAILED;
        }
        const newOfferLetter = new offer_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
        yield newOfferLetter.save();
        return {
            email: offerLetterData.employeeEmail,
            status: updatedData.status,
        };
    });
}
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
            const offerLetter = yield offer_letter_model_1.default.findOneAndUpdate({ employeeEmail }, {
                acknowledge: true,
            }, {
                upsert: true,
            });
            if (!offerLetter) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Offer letter not found!");
            }
            return null;
        });
    },
    createOfferLetter(offerLetterData, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign({}, offerLetterData);
            if ((offerLetterData.status = offer_letter_interface_1.offerLetterStatus.SENT)) {
                const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(Object.assign({ userName: offerLetterData.employeeEmail || "" }, updatedData), "offerLetter");
                const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generateOfferLetterPDF)(offerLetterData);
                const attachment = {
                    filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
                    content: pdfBuffer,
                    encoding: "base64", // if necessary
                };
                const result = yield emailHelper_1.EmailHelper.sendEmail(
                //@ts-ignore
                offerLetterData.employeeEmail, emailContent, "Offer letter confirmed!", attachment);
                if (result.status === offer_letter_interface_1.offerLetterStatus.SENT) {
                    updatedData.status = offer_letter_interface_1.offerLetterStatus.SENT;
                }
                else {
                    updatedData.status = offer_letter_interface_1.offerLetterStatus.FAILED;
                }
            }
            const newOfferLetter = new offer_letter_model_1.default(Object.assign(Object.assign({}, updatedData), { generateByUser: authUser.userId }));
            const result = yield newOfferLetter.save();
            return result;
        });
    },
    createBulkOfferLetters(offerLetters, authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(offerLetters.map((data) => limit(() => processOneOfferLetter(data, authUser))));
            return results;
        });
    },
    // async updateOfferLetter(
    //   productId: string,
    //   payload: Partial<IProduct>,
    //   productImages: IImageFiles,
    //   authUser: IJwtPayload
    // ) {
    //   const { images } = productImages;
    //   const user = await User.findById(authUser.userId);
    //   const shop = await Shop.findOne({ user: user?._id });
    //   const product = await Product.findOne({
    //     shop: shop?._id,
    //     _id: productId,
    //   });
    //   if (!user?.isActive) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
    //   }
    //   if (!shop) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop");
    //   }
    //   if (!shop.isActive) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Your shop is inactive");
    //   }
    //   if (!product) {
    //     throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
    //   }
    //   if (images && images.length > 0) {
    //     payload.imageUrls = images.map((image) => image.path);
    //   }
    //   return await Product.findByIdAndUpdate(productId, payload, { new: true });
    // },
    // async deleteOfferLetter(productId: string, authUser: IJwtPayload) {
    //   const user = await User.findById(authUser.userId);
    //   const shop = await Shop.findOne({ user: user?._id });
    //   const product = await Product.findOne({
    //     shop: shop?._id,
    //     _id: productId,
    //   });
    //   if (!user?.isActive) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
    //   }
    //   if (!shop) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop");
    //   }
    //   if (!product) {
    //     throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
    //   }
    //   return await Product.findByIdAndDelete(productId);
    // },
};
