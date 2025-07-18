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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const flashSale_model_1 = require("./flashSale.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createFlashSale = (flashSellData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userHasShop = yield user_model_1.default.findById(authUser.userId).select("isActive hasShop");
    if (!userHasShop)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    if (!userHasShop.isActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User account is not active!");
    // if (!userHasShop.hasShop) throw new AppError(StatusCodes.BAD_REQUEST, "User does not have any shop!");
    const shopIsActive = yield shop_model_1.default.findOne({
        user: userHasShop._id,
        isActive: true,
    }).select("isActive");
    if (!shopIsActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Shop is not active!");
    const { products, discountPercentage } = flashSellData;
    const createdBy = authUser.userId;
    const operations = products.map((product) => ({
        updateOne: {
            filter: { product },
            update: {
                $setOnInsert: {
                    product,
                    discountPercentage,
                    createdBy,
                },
            },
            upsert: true,
        },
    }));
    const result = yield flashSale_model_1.FlashSale.bulkWrite(operations);
    return result;
});
const getActiveFlashSalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice } = query, pQuery = __rest(query, ["minPrice", "maxPrice"]);
    const flashSaleQuery = new QueryBuilder_1.default(flashSale_model_1.FlashSale.find()
        .populate("product")
        .populate("product.category", "name")
        .populate("product.shop", "shopName")
        .populate("product.brand", "name"), query).paginate();
    const flashSales = yield flashSaleQuery.modelQuery.lean();
    const flashSaleMap = flashSales.reduce((acc, flashSale) => {
        //@ts-ignore
        acc[flashSale.product._id.toString()] = flashSale.discountPercentage;
        return acc;
    }, {});
    const productsWithOfferPrice = flashSales.map((flashSale) => {
        const product = flashSale.product;
        //@ts-ignore
        const discountPercentage = flashSaleMap[product._id.toString()];
        if (discountPercentage) {
            const discount = (discountPercentage / 100) * product.price;
            product.offerPrice = product.price - discount;
        }
        else {
            product.offerPrice = null;
        }
        return product;
    });
    const meta = yield flashSaleQuery.countTotal();
    return {
        meta,
        result: productsWithOfferPrice,
    };
});
exports.FlashSaleService = {
    createFlashSale,
    getActiveFlashSalesService,
};
