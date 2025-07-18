import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { releaseLetterController } from "./release-letter.controller";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-release-letter-csv",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  multerUpload.single("multipleReleaseLetterCsv"),
  releaseLetterController.createBulkOfferLetter
);

router.post(
  "/send-release-letter-csv",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  releaseLetterController.createBulkReleaseLetterWithData
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  releaseLetterController.getOfferLetterAll
);

export const ReleaseLetterRoutes = router;
