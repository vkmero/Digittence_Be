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

    const latestAttendance = await Attendance.findOne({
      class: classId,
      subject,
      date
    }).sort({ attendanceSlot: -1 });

    let attendanceSlot = 1;

    if (latestAttendance) {
      attendanceSlot = (latestAttendance.attendanceSlot ?? 1) + 1;
    }

    const attendanceData = records.map(record => ({
      faculty: req.facultyId,
      student: record.student,
      class: classId,
      subject,
      date,
      attendanceSlot,
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