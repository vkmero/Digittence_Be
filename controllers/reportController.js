import Attendance from "../models/Attendance.js";
import generateExcel from "../utils/generateExcel.js";

export const generateReport = async (req, res) => {
  const { classId, start, end } = req.body;

  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);

const attendance = await Attendance.find({
  faculty: req.facultyId,
  class: classId,
  date: { $gte: startDate, $lte: endDate }
}).populate("student");

  const report = {};

  attendance.forEach(a => {
    if (!a.student) return; 

    const id = a.student._id.toString();

    if (!report[id]) {
      report[id] = {
        roll: a.student.rollNo,
        name: a.student.name,
        attended: 0,
        total: 0
      };
    }

    report[id].total += a.hours;
    if (a.status === "P") {
      report[id].attended += a.hours;
    }
  });

  const finalData = Object.values(report);

  await generateExcel(finalData, res);
};
