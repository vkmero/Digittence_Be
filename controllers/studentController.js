import Student from "../models/Student.js";
import Class from "../models/Class.js";

export const addStudent = async (req, res) => {
  try {
    const { name, rollNo, class: classId } = req.body;

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (cls.faculty.toString() !== req.facultyId) {
      return res.status(403).json({
        message: "Only class creator can add students"
      });
    }

    const student = await Student.create({ name, rollNo, class: classId });
    res.json(student);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Roll number already exists in this class"
      });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getStudents = async (req, res) => {
  const students = await Student.find({ class: req.params.classId });
  res.json(students);
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const cls = await Class.findById(student.class);
    if (cls.faculty.toString() !== req.facultyId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    student.name = req.body.name;
    student.rollNo = req.body.rollNo;

    await student.save();
    res.json(student);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Roll number already exists in this class"
      });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const cls = await Class.findById(student.class);
  if (cls.faculty.toString() !== req.facultyId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await student.deleteOne();
  res.json({ message: "Student deleted" });
};
