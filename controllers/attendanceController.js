import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { class: classId, subject, date, hours, records } = req.body;

    for (const r of records) {
      await Attendance.updateOne(
        {
          student: r.student,
          class: classId,
          subject,
          date
        },
        {
          faculty: req.facultyId,
          student: r.student,
          class: classId,
          subject,
          date,
          hours,
          status: r.status
        },
        { upsert: true }
      );
    }

    res.json({ message: "Attendance saved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};