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
exports.ProductService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const category_model_1 = require("../category/category.model");
const product_model_1 = require("./product.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const order_model_1 = require("../order/order.model");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const review_model_1 = require("../review/review.model");
const flashSale_model_1 = require("../flashSell/flashSale.model");
const hasActiveShop_1 = require("../../utils/hasActiveShop");
const createProduct = (productData, productImages, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield (0, hasActiveShop_1.hasActiveShop)(authUser.userId);
    const { images } = productImages;
    if (!images || images.length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product images are required.");
    }
    productData.imageUrls = images.map((image) => image.path);
    const isCategoryExists = yield category_model_1.Category.findById(productData.category);
    if (!isCategoryExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category does not exist!");
    }
    if (!isCategoryExists.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category is not active!");
    }
    const newProduct = new product_model_1.Product(Object.assign(Object.assign({}, productData), { shop: shop._id }));
    const result = yield newProduct.save();
    return result;
});
// const getAllProduct = async (query: Record<string, unknown>) => {
//    const { minPrice, maxPrice, ...pQuery } = query;
//    const productQuery = new QueryBuilder(
//       Product.find()
//          .populate('category', 'name')
//          .populate('shop', 'shopName')
//          .populate('brand', 'name'),
//       pQuery
//    )
//       .search(['name', 'description'])
//       .filter()
//       .sort()
//       .paginate()
//       .fields()
//       .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
//    const products = await productQuery.modelQuery.lean();
//    const meta = await productQuery.countTotal();
//    const productIds = products.map((product: any) => product._id);
//    const flashSales = await FlashSale.find({
//       product: { $in: productIds },
//       discountPercentage: { $gt: 0 },
//    }).select('product discountPercentage');
//    const flashSaleMap = flashSales.reduce((acc, { product, discountPercentage }) => {
//       //@ts-ignore
//       acc[product.toString()] = discountPercentage;
//       return acc;
//    }, {});
//    const updatedProducts = products.map((product: any) => {
//       //@ts-ignore
//       const discountPercentage = flashSaleMap[product._id.toString()];
//       if (discountPercentage) {
//          product.offerPrice = product.price * (1 - discountPercentage / 100);
//       } else {
//          product.offerPrice = null;
//       }
//       return product;
//    });
//    return {
//       meta,
//       result: updatedProducts,
//    };
// };
// Product.service.ts
const getAllProduct = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice, categories, brands, inStock, ratings } = query, pQuery = __rest(query, ["minPrice", "maxPrice", "categories", "brands", "inStock", "ratings"]);
    // Build the filter object
    const filter = {};
    // Filter by categories
    if (categories) {
        const categoryArray = typeof categories === "string"
            ? categories.split(",")
            : Array.isArray(categories)
                ? categories
                : [categories];
        filter.category = { $in: categoryArray };
    }
    // Filter by brands
    if (brands) {
        const brandArray = typeof brands === "string"
            ? brands.split(",")
            : Array.isArray(brands)
                ? brands
                : [brands];
        filter.brand = { $in: brandArray };
    }
    // Filter by in stock/out of stock
    if (inStock !== undefined) {
        filter.stock = inStock === "true" ? { $gt: 0 } : 0;
    }
    // Filter by ratings
    if (ratings) {
        const ratingArray = typeof ratings === "string"
            ? ratings.split(",")
            : Array.isArray(ratings)
                ? ratings
                : [ratings];
        filter.averageRating = { $in: ratingArray.map(Number) };
    }
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find(filter)
        .populate("category", "name")
        .populate("shop", "shopName")
        .populate("brand", "name"), pQuery)
        .search(["name", "description"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
    const products = yield productQuery.modelQuery.lean();
    const meta = yield productQuery.countTotal();
    // Get Flash Sale Discounts
    const productIds = products.map((product) => product._id);
    const flashSales = yield flashSale_model_1.FlashSale.find({
        product: { $in: productIds },
        discountPercentage: { $gt: 0 },
    }).select("product discountPercentage");
    const flashSaleMap = flashSales.reduce((acc, { product, discountPercentage }) => {
        //@ts-ignore
        acc[product.toString()] = discountPercentage;
        return acc;
    }, {});
    // Add offer price to products
    const updatedProducts = products.map((product) => {
        //@ts-ignore
        const discountPercentage = flashSaleMap[product._id.toString()];
        if (discountPercentage) {
            product.offerPrice = product.price * (1 - discountPercentage / 100);
        }
        else {
            product.offerPrice = null;
        }
        return product;
    });
    return {
        meta,
        result: updatedProducts,
    };
});
const getTrendingProducts = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));
    const trendingProducts = yield order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: { $gte: last30Days },
            },
        },
        {
            $unwind: "$products",
        },
        {
            $group: {
                _id: "$products.product",
                orderCount: { $sum: "$products.quantity" },
            },
        },
        {
            $sort: { orderCount: -1 },
        },
        {
            $limit: limit || 10,
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: "$productDetails",
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                orderCount: 1,
                name: "$productDetails.name",
                price: "$productDetails.price",
                offer: "$productDetails.offer",
                imageUrls: "$productDetails.imageUrls",
            },
        },
    ]);
    return trendingProducts;
});
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId).populate("shop brand category");
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found");
    }
    if (!product.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product is not active");
    }
    const offerPrice = yield product.calculateOfferPrice();
    const reviews = yield review_model_1.Review.find({ product: product._id });
    const productObj = product.toObject();
    return Object.assign(Object.assign({}, productObj), { offerPrice,
        reviews });
});
const getMyShopProducts = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { minPrice, maxPrice } = query, pQuery = __rest(query, ["minPrice", "maxPrice"]);
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find({ shop: shopIsActive._id })
        .populate("category", "name")
        .populate("shop", "shopName")
        .populate("brand", "name"), pQuery)
        .search(["name", "description"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
    const products = yield productQuery.modelQuery.lean();
    const productsWithOfferPrice = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const productDoc = yield product_model_1.Product.findById(product._id);
        const offerPrice = productDoc === null || productDoc === void 0 ? void 0 : productDoc.offerPrice;
        return Object.assign(Object.assign({}, product), { offerPrice: Number(offerPrice) || null });
    })));
    const meta = yield productQuery.countTotal();
    return {
        meta,
        result: productsWithOfferPrice,
    };
});
const updateProduct = (productId, payload, productImages, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { images } = productImages;
    const user = yield user_model_1.default.findById(authUser.userId);
    const shop = yield shop_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    const product = yield product_model_1.Product.findOne({
        shop: shop === null || shop === void 0 ? void 0 : shop._id,
        _id: productId,
    });
    if (!(user === null || user === void 0 ? void 0 : user.isActive)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not active");
    }
    if (!shop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You don't have a shop");
    }
    if (!shop.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your shop is inactive");
    }
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product Not Found");
    }
    if (images && images.length > 0) {
        payload.imageUrls = images.map((image) => image.path);
    }
    return yield product_model_1.Product.findByIdAndUpdate(productId, payload, { new: true });
});
const deleteProduct = (productId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(authUser.userId);
    const shop = yield shop_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    const product = yield product_model_1.Product.findOne({
        shop: shop === null || shop === void 0 ? void 0 : shop._id,
        _id: productId,
    });
    if (!(user === null || user === void 0 ? void 0 : user.isActive)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not active");
    }
    if (!shop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You don't have a shop");
    }
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product Not Found");
    }
    return yield product_model_1.Product.findByIdAndDelete(productId);
});
exports.ProductService = {
    createProduct,
    getAllProduct,
    getTrendingProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getMyShopProducts,
};
