import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";

dotenv.config();      
connectDB();           

const app = express();
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/report", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
