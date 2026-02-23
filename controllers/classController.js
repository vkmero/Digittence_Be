import Class from "../models/Class.js";

export const createClass = async (req, res) => {
  const newClass = await Class.create({
    className: req.body.className,
    faculty: req.facultyId
  });
  res.json(newClass);
};

export const getClasses = async (req, res) => {
  const classes = await Class.find({ faculty: req.facultyId })
    .sort({ createdAt: -1 });

  res.json(classes);
};

export const updateClass = async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls) return res.status(404).json({ message: "Class not found" });

  if (cls.faculty.toString() !== req.facultyId)
    return res.status(403).json({ message: "Not allowed" });

  cls.className = req.body.className;
  await cls.save();

  res.json(cls);
};

export const deleteClass = async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls) return res.status(404).json({ message: "Class not found" });

  if (cls.faculty.toString() !== req.facultyId)
    return res.status(403).json({ message: "Not allowed" });

  await cls.deleteOne();
  res.json({ message: "Class deleted" });
};
