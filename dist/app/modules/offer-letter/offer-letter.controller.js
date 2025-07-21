"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.offerLetterController = void 0;
const offer_letter_service_1 = require("./offer-letter.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const XLSX = __importStar(require("xlsx"));
const appError_1 = __importDefault(require("../../errors/appError"));
exports.offerLetterController = {
    // async getAll() {
    //   return catchAsync(async (req, res) => {
    //     const result = await offerLetterService.getOfferLetterAll(req.query);
    //     sendResponse(res, {
    //       statusCode: StatusCodes.OK,
    //       success: true,
    //       message: "OfferLetter are retrieved successfully",
    //       meta: result.meta,
    //       data: result.result,
    //     });
    //   });
    // },
    getOfferLetterAll: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield offer_letter_service_1.offerLetterService.getOfferLetterAll(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "OfferLetter are retrieved successfully",
            meta: result.meta,
            data: result.result,
        });
    })),
    createOfferLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield offer_letter_service_1.offerLetterService.createOfferLetter(req.body, req.user);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: "Offer Letter created succesfully",
                data: result,
            });
        });
    },
    getOfferLetterById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield offer_letter_service_1.offerLetterService.getOfferLetterById(req.params.id);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: "Offer Letter retrived succesfully",
                data: result,
            });
        });
    },
    acknowledgeById: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // async acknowledgeById(req: Request, res: Response) {
        const message = yield offer_letter_service_1.offerLetterService.acknowledgeById(req.params.employeeEmail);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: message.message || "Offer letter acknowledged successfully",
            data: null,
        });
    })),
    createBulkOfferLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Empty or invalid Excel file");
            }
            const workbook = XLSX.read(file.buffer, {
                type: "buffer",
                cellDates: true, // Important: forces cells to be parsed as Date objects
            });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                defval: "", // Keeps empty cells instead of skipping
                raw: false, // Converts dates and numbers properly
            });
            const results = yield offer_letter_service_1.offerLetterService.createBulkOfferLetters(rows, req.user);
            console.log(rows, "rows");
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Bulk offer letters processed",
                data: results,
            });
        });
    },
};
