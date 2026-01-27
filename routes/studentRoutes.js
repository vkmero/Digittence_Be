import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", protect, addStudent);
router.get("/:classId", protect, getStudents);

router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

export default router;
