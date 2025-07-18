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
exports.hasActiveShop = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../errors/appError"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const shop_model_1 = __importDefault(require("../modules/shop/shop.model"));
const hasActiveShop = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.default.checkUserExist(userId);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    // if (!isUserExists.hasShop) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop!");
    // }
    const shop = yield shop_model_1.default.findOne({ user: isUserExists._id }).select("isActive");
    if (!shop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Shop does not exist!");
    }
    if (!shop.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your shop is not active!");
    }
    return shop;
});
exports.hasActiveShop = hasActiveShop;
