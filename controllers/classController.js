import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const createClass = async (req, res) => {
  const newClass = await Class.create({
    className: req.body.className,
    faculty: req.facultyId
  });
  res.json(newClass);
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

    if (classDoc.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    classDoc.className = req.body.className;
    await classDoc.save();

    res.json(classDoc);
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

    if (classDoc.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await classDoc.deleteOne();

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};