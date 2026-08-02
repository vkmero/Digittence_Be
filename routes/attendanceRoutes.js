import express from "express";
import protect from "../middleware/authMiddleware.js";
import { markAttendance, getAttendance, updateAttendance, getAttendanceSlots } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/slots", protect, getAttendanceSlots);
router.get("/", protect, getAttendance);
router.post("/", protect, markAttendance);
router.put("/", protect, updateAttendance);

export default router;
