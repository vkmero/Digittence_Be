import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { class: classId, subject, date, hours, records } = req.body;

    if (!classId || !subject || !date || !hours || !records) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.facultyId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const subjectAlreadyMarked = await Attendance.findOne({
      class: classId,
      subject,
      date
    });

    if (subjectAlreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked for this subject today"
      });
    }

    const facultyAlreadyMarked = await Attendance.findOne({
      class: classId,
      faculty: req.facultyId,
      date
    });

    if (facultyAlreadyMarked) {
      return res.status(400).json({
        message: "You have already marked attendance for this class today"
      });
    }

    const attendanceData = records.map(record => ({
      faculty: req.facultyId,
      student: record.student,
      class: classId,
      subject,
      date,
      hours,
      status: record.status
    }));

    await Attendance.insertMany(attendanceData);

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};