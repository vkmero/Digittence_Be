import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass
} from "../controllers/classController.js";

const router = express.Router();

router.post("/", protect, createClass);
router.get("/", protect, getClasses);
router.put("/:id", protect, updateClass);
router.delete("/:id", protect, deleteClass);

export default router;
