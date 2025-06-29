import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { payslipController } from "./payslip.controller";
import multer from "multer";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  payslipController.createOfferLetter
);

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-payslip-csv",
  auth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("multiplePayslipCsv"),
  payslipController.createBulkOfferLetter
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  payslipController.getOfferLetterAll
);

router.get(
  "/html/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  payslipController.getOfferLetterById
);

export const PayslipLetterRoutes = router;
