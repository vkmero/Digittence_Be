import ExcelJS from "exceljs";

const generateExcel = async (data, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance Report");

  worksheet.addRow([
    "Roll No",
    "Name",
    "Attended Hours",
    "Total Hours",
    "Attendance %"
  ]);

  worksheet.getRow(1).font = { bold: true };

  data.forEach(student => {
    const percentage =
      student.total === 0
        ? 0
        : ((student.attended / student.total) * 100).toFixed(2);

    worksheet.addRow([
      student.roll,
      student.name,
      student.attended,
      student.total,
      percentage
    ]);
  });

  worksheet.columns.forEach(col => {
    col.width = 20;
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendance_report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

export default generateExcel;