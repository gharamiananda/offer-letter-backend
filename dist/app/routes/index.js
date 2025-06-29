"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const category_routes_1 = require("../modules/category/category.routes");
const product_routes_1 = require("../modules/product/product.routes");
const order_routes_1 = require("../modules/order/order.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const sslcommerz_routes_1 = require("../modules/sslcommerz/sslcommerz.routes");
const brand_routes_1 = require("../modules/brand/brand.routes");
const shop_routes_1 = require("../modules/shop/shop.routes");
const review_routes_1 = require("../modules/review/review.routes");
const flashSale_routes_1 = require("../modules/flashSell/flashSale.routes");
const meta_route_1 = require("../modules/meta/meta.route");
const offer_letter_routes_1 = require("../modules/offer-letter/offer-letter.routes");
const payslip_routes_1 = require("../modules/payslip/payslip.routes");
const candidate_exam_routes_1 = require("../modules/candidate-exam/candidate-exam.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/offer-letter",
        route: offer_letter_routes_1.OfferLetterRoutes,
    },
    {
        path: "/payslip",
        route: payslip_routes_1.PayslipLetterRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/shop",
        route: shop_routes_1.ShopRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/brand",
        route: brand_routes_1.BrandRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.ProductRoutes,
    },
    {
        path: "/flash-sale",
        route: flashSale_routes_1.FlashSaleRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/coupon",
        route: coupon_routes_1.CouponRoutes,
    },
    {
        path: "/ssl",
        route: sslcommerz_routes_1.SSLRoutes,
    },
    {
        path: "/review",
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: "/meta",
        route: meta_route_1.MetaRoutes,
    },
    {
        path: "/candidate-exam",
        route: candidate_exam_routes_1.CandidateExamRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
