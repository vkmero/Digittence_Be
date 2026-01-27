import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    await Attendance.insertMany(records, { ordered: false });

    res.json({ message: "Attendance saved" });
  } catch (err) {
    if (err.code === 11000) {
  return res.status(409).json({
    message: "Attendance already marked for this subject on this date"
  });
}
    res.status(500).json({ message: err.message });
  }
};

