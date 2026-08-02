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

    const attendanceDate = new Date(date);

    const latestAttendance = await Attendance.findOne({
      class: classId,
      subject,
      date: attendanceDate
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
      date: attendanceDate,
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

export const getAttendance = async (req, res) => {
  try {
    const { classId, subject, date, attendanceSlot } = req.query;

    if (!classId || !subject || !date || !attendanceSlot) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const students = await Student.find({ class: classId }).sort({ rollNo: 1 });

    const attendance = await Attendance.find({
      class: classId,
      subject,
      date: new Date(date),
      attendanceSlot: Number(attendanceSlot)
    });

    const attendanceMap = {};

    attendance.forEach(record => {
      attendanceMap[record.student.toString()] = record.status;
    });

    const response = students.map(student => ({
      _id: student._id,
      name: student.name,
      rollNo: student.rollNo,
      status: attendanceMap[student._id.toString()] || "P"
    }));

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {

    const {
      classId,
      subject,
      date,
      attendanceSlot,
      records
    } = req.body;

    if (!classId || !subject || !date || !attendanceSlot || !records) {
      return res.status(400).json({
        message: "Missing fields"
      });
    }

    for (const record of records) {

      await Attendance.findOneAndUpdate(
        {
          class: classId,
          subject,
          date: new Date(date),
          attendanceSlot,
          student: record.student
        },
        {
          status: record.status
        }
      );

    }

    res.json({
      message: "Attendance updated successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};

export const getAttendanceSlots = async (req, res) => {
  try {

    const { classId, subject, date } = req.query;

    if (!classId || !subject || !date) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const slots = await Attendance.distinct("attendanceSlot", {
      class: classId,
      subject,
      date: new Date(date)
    });

    slots.sort((a, b) => a - b);

    res.json(slots);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};