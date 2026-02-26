import Student from "../models/Student.js";
import Class from "../models/Class.js";
import XLSX from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";

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

export const uploadStudents = async (req, res) => {
  try {
    const classId = req.params.classId;

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (cls.faculty.toString() !== req.facultyId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const studentsToInsert = [];

    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    if (fileExt === "xlsx") {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      data.forEach(row => {
        const keys = Object.keys(row);

        const nameKey = keys.find(k => k.toLowerCase() === "name");
        const rollKey = keys.find(k => k.toLowerCase() === "rollno");

        if (nameKey && rollKey) {
          studentsToInsert.push({
            name: String(row[nameKey]).trim(),
            rollNo: String(row[rollKey]).trim(),
            class: classId
          });
        }
      });
    }

    else if (fileExt === "csv") {
      const stream = Readable.from(req.file.buffer.toString());

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
                    .on("data", row => {
            const keys = Object.keys(row);

            const nameKey = keys.find(k => k.toLowerCase() === "name");
            const rollKey = keys.find(k => k.toLowerCase() === "rollno");

            if (nameKey && rollKey) {
              studentsToInsert.push({
                name: String(row[nameKey]).trim(),
                rollNo: String(row[rollKey]).trim(),
                class: classId
              });
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });
    }

    else {
      return res.status(400).json({
        message: "Only .xlsx and .csv files are allowed"
      });
    }

    if (studentsToInsert.length === 0) {
      return res.status(400).json({
        message: "No valid student data found in file"
      });
    }

    await Student.insertMany(studentsToInsert, { ordered: false });

    res.json({
      message: "Students uploaded successfully",
      count: studentsToInsert.length
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Some roll numbers already exist in this class"
      });
    }

    res.status(500).json({ message: err.message });
  }
};