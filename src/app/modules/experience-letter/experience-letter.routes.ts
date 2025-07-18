import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { releaseLetterController } from "./experience-letter.controller";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-experience-letter-csv",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER),
  multerUpload.single("multipleExperienceLetterCsv"),
  releaseLetterController.createBulkOfferLetter
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  releaseLetterController.getOfferLetterAll
);

export const ExperienceLetterRoutes = router;
