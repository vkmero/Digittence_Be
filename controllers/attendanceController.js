import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

export const markAttendance = async (req, res) => {
  try {
    const { class: classId, subject, date, hours, records } = req.body;

    if (!classId || !subject || !date || !hours || !records) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.facultyId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const latestAttendance = await Attendance.findOne({
      class: classId,
      subject,
      date
    }).sort({ attendanceSlot: -1 });

    let attendanceSlot = 1;

    if (latestAttendance) {
      attendanceSlot = (latestAttendance.attendanceSlot ?? 1) + 1;
    }

    const students = await Student.find({ class: classId });

    const absentStudents = new Set(
      records.map(record => record.student.toString())
    );

    const attendanceData = students.map(student => ({
      faculty: req.facultyId,
      student: student._id,
      class: classId,
      subject,
      date,
      attendanceSlot,
      hours,
      status: absentStudents.has(student._id.toString()) ? "A" : "P"
    }));

    console.log(attendanceData.slice(0,5));
    await Attendance.insertMany(attendanceData);

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};