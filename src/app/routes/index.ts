import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { CouponRoutes } from "../modules/coupon/coupon.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
import { BrandRoutes } from "../modules/brand/brand.routes";
import { ShopRoutes } from "../modules/shop/shop.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { FlashSaleRoutes } from "../modules/flashSell/flashSale.routes";
import { MetaRoutes } from "../modules/meta/meta.route";
import { OfferLetterRoutes } from "../modules/offer-letter/offer-letter.routes";
import { PayslipLetterRoutes } from "../modules/payslip/payslip.routes";
import { CandidateExamRoutes } from "../modules/candidate-exam/candidate-exam.routes";
import { OrganizationRoutes } from "../modules/organization/organization.routes";
import { ReleaseLetterRoutes } from "../modules/release-letter/release-letter.routes";
import { ExperienceLetterRoutes } from "../modules/experience-letter/experience-letter.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/offer-letter",
    route: OfferLetterRoutes,
  },
  {
    path: "/payslip",
    route: PayslipLetterRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/flash-sale",
    route: FlashSaleRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
  {
    path: "/ssl",
    route: SSLRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  },
  {
    path: "/candidate-exam",
    route: CandidateExamRoutes,
  },
  {
    path: "/organization",
    route: OrganizationRoutes,
  },
  {
    path: "/release-letter",
    route: ReleaseLetterRoutes,
  },
  {
    path: "/experience-letter",
    route: ExperienceLetterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
