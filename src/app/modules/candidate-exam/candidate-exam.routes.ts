import { Router } from "express";
import { candidateExamController } from "./candidate-exam.controller";
import auth from "../../middleware/auth";
import { multerUpload } from "../../config/multer.config";
import { UserRole } from "../user/user.interface";
import { parseBody } from "../../middleware/bodyParser";

const router = Router();

router.get("/", candidateExamController.getcandidateExamAll);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  candidateExamController.getcandidateExamById
);

router.post(
  "/",
  multerUpload.single("cv"),
  parseBody,
  candidateExamController.createcandidateExam
);

router.patch("/:candidateId", candidateExamController.updateCandidateExamById);
export const CandidateExamRoutes = router;
