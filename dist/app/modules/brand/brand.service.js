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
exports.BrandService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const brand_model_1 = require("./brand.model");
const user_interface_1 = require("../user/user.interface");
const product_model_1 = require("../product/product.model");
const createBrand = (brandData, logo, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (logo && logo.path) {
        brandData.logo = logo.path;
    }
    const brand = new brand_model_1.Brand(Object.assign(Object.assign({}, brandData), { createdBy: authUser.userId }));
    const result = yield brand.save();
    return result;
});
const getAllBrand = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = new QueryBuilder_1.default(brand_model_1.Brand.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield brandQuery.modelQuery;
    const meta = yield brandQuery.countTotal();
    return {
        meta,
        result,
    };
});
const updateBrandIntoDB = (id, payload, file, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(id);
    if (!isBrandExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Brand not found!');
    }
    if (authUser.role === user_interface_1.UserRole.USER &&
        isBrandExist.createdBy.toString() !== authUser.userId) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You are not able to edit the category!');
    }
    if (file && file.path) {
        payload.logo = file.path;
    }
    const result = yield brand_model_1.Brand.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteBrandIntoDB = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(id);
    if (!isBrandExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Brand not found!');
    }
    if (authUser.role === user_interface_1.UserRole.USER &&
        isBrandExist.createdBy.toString() !== authUser.userId) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You are not able to delete the brand!');
    }
    const product = yield product_model_1.Product.findOne({ brand: id });
    if (product)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can not delete the brand. Because the brand is related to products.");
    const deletedBrand = yield brand_model_1.Brand.findByIdAndDelete(id);
    return deletedBrand;
});
exports.BrandService = {
    createBrand,
    getAllBrand,
    updateBrandIntoDB,
    deleteBrandIntoDB
};
