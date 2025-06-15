import { Router } from "express";
import { offerLetterController } from "./offer-letter.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
// import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParser";

const router = Router();

// Define routes
// router.get("/", offerLetterController.getAll);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  // validateRequest(categoryValidation.createCategoryValidationSchema),
  offerLetterController.createOfferLetter
);
import multer from "multer";

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-offer-letter-csv",
  auth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("multipleOfferLetterCsv"),

  // validateRequest(categoryValidation.createCategoryValidationSchema),
  offerLetterController.createBulkOfferLetter
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  offerLetterController.getOfferLetterAll
);

router.get(
  "/html/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  offerLetterController.getOfferLetterById
);

router.get("/offer-acknowledge/:id", offerLetterController.acknowledgeById);

export const OfferLetterRoutes = router;
