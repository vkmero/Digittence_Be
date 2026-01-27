import Subject from "../models/Subject.js";
import Class from "../models/Class.js";

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find({ class: req.params.classId });
  res.json(subjects);
};

export const addSubject = async (req, res) => {
  try {
    const { name, class: classId } = req.body;

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    if (cls.faculty.toString() !== req.facultyId) {
      return res.status(403).json({
        message: "Only class creator can add subjects"
      });
    }

    const subject = await Subject.create({ name, class: classId });
    res.json(subject);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Subject already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};
