import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { sentMailStatusController } from "./mail-status.controller";
// import { sentMailStatusController } from './mail-status.controller';
// import { sentMailStatusController } from './sentMailStatus.controller';

const router = Router();

// Create a new mail process status
router.post(
  "/",
  auth(UserRole.ADMIN), // or USER if needed
  sentMailStatusController.createSentMailStatus
);

// Get all mail process statuses
router.get(
  "/",
  auth(UserRole.ADMIN),
  sentMailStatusController.getAllSentMailStatuses
);

// Get mail status by processId
router.get(
  "/:processId",
  auth(UserRole.ADMIN, UserRole.USER),
  sentMailStatusController.getSentMailStatusByProcessId
);

// Update mail process status
router.patch(
  "/:processId",
  auth(UserRole.ADMIN),
  sentMailStatusController.updateSentMailStatus
);

// Soft delete a mail status
router.delete(
  "/:processId",
  auth(UserRole.ADMIN),
  sentMailStatusController.deleteSentMailStatus
);

export const SentMailStatusRoutes = router;
