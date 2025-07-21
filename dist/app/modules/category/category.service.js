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
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const category_model_1 = require("./category.model");
const user_interface_1 = require("../user/user.interface");
const product_model_1 = require("../product/product.model");
const createCategory = (categoryData, icon, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new category_model_1.Category(Object.assign(Object.assign({}, categoryData), { createdBy: authUser.userId, icon: icon === null || icon === void 0 ? void 0 : icon.path }));
    const result = yield category.save();
    return result;
});
const getAllCategory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = new QueryBuilder_1.default(category_model_1.Category.find().populate('parent'), query)
        .search(['name', 'slug'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const categories = yield categoryQuery.modelQuery;
    const meta = yield categoryQuery.countTotal();
    const categoryMap = new Map();
    const hierarchy = [];
    categories.forEach((category) => {
        categoryMap.set(category._id.toString(), Object.assign(Object.assign({}, category.toObject()), { children: [] }));
    });
    categories.forEach((category) => {
        var _a, _b;
        const parentId = (_b = (_a = category.parent) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
        if (parentId && categoryMap.has(parentId)) {
            categoryMap.get(parentId).children.push(categoryMap.get(category._id.toString()));
        }
        else if (!parentId) {
            hierarchy.push(categoryMap.get(category._id.toString()));
        }
    });
    return {
        meta,
        result: hierarchy,
    };
});
const updateCategoryIntoDB = (id, payload, file, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield category_model_1.Category.findById(id);
    if (!isCategoryExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found!");
    }
    if ((authUser.role === user_interface_1.UserRole.USER) && (isCategoryExist.createdBy.toString() !== authUser.userId)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not able to edit the category!");
    }
    if (file && file.path) {
        payload.icon = file.path;
    }
    const result = yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteCategoryIntoDB = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield category_model_1.Category.findById(id);
    if (!isBrandExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Category not found!');
    }
    if (authUser.role === user_interface_1.UserRole.USER &&
        isBrandExist.createdBy.toString() !== authUser.userId) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You are not able to delete the Category!');
    }
    const product = yield product_model_1.Product.findOne({ category: id });
    if (product)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can not delete the Category. Because the Category is related to products.");
    const deletedCategory = yield category_model_1.Category.findByIdAndDelete(id);
    return deletedCategory;
});
exports.CategoryService = {
    createCategory,
    getAllCategory,
    updateCategoryIntoDB,
    deleteCategoryIntoDB
};
