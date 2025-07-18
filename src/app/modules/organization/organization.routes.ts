import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { parseBody } from "../../middleware/bodyParser";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middleware/validateRequest";
import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";

const router = Router();

router.get(
  "/my-organization",
  auth(UserRole.USER),
  OrganizationController.getMyOrganization
);

router.post(
  "/",
  auth(UserRole.SUPERADMIN),
  multerUpload.single("logo"),
  parseBody,
  validateRequest(OrganizationValidation.createOrganizationValidation),
  OrganizationController.createOrganization
);

export const OrganizationRoutes = router;
