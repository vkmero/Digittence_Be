import ExcelJS from "exceljs";

const generateExcel = async (data, res, className, startDate, endDate) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
  `${className} Attendance`
  );

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

const formatDate = (date) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const safeClassName = (className || "Attendance_Report")
  .trim()
  .replace(/\s+/g, "_")
  .replace(/[<>:"/\\|?*]/g, "");

const fileName =
  `${safeClassName}_${formatDate(startDate)}_to_${formatDate(endDate)}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
  );

  await workbook.xlsx.write(res);
  res.end();
};

export default generateExcel;