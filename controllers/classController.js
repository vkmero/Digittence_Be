import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const createClass = async (req, res) => {
  try {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const existingClass = await Class.findOne({ className });

    if (existingClass) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = await Class.create({
      className,
      faculty: req.facultyId
    });

    res.status(201).json(newClass);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("faculty", "name email");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classDoc.faculty.toString() !== req.facultyId) {
      return res.status(403).json({ message: "Not authorized to edit this class" });
    }

    classDoc.className = req.body.className;
    await classDoc.save();

    res.json({ message: "Class updated successfully", classDoc });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classDoc.faculty.toString() !== req.facultyId) {
      return res.status(403).json({ message: "Not authorized to delete this class" });
    }

    await classDoc.deleteOne();

    res.json({ message: "Class deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};