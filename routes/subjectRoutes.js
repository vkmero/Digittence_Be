import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getSubjects, addSubject } from "../controllers/subjectController.js";

const router = express.Router();

router.get("/:classId", protect, getSubjects);
router.post("/", protect, addSubject);

export default router;
