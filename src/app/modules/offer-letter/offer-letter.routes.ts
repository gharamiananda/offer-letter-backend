import { Router } from "express";
import { offerLetterController } from "./offer-letter.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
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
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  offerLetterController.getOfferLetterAll
);
export const OfferLetterRoutes = router;
