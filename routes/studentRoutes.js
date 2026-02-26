import express from "express";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  uploadStudents 
} from "../controllers/studentController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post("/", protect, addStudent);
router.get("/:classId", protect, getStudents);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

router.post("/upload/:classId", protect, upload.single("file"), uploadStudents);

export default router;