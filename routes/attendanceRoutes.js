import express from "express";
import protect from "../middleware/authMiddleware.js";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", protect, getAttendance);
router.post("/", protect, markAttendance);

export default router;
