const express = require("express");

const app = express();

const student = [
  { id: 1, name: "pavan", branch: "ise" },
  { id: 2, name: "pai", branch: "cse" },
];

app.get("/", (req, res) => {
  res.json(student);
});

app.get("/student/:id", (req, res) => {
  const id = Number(req.params.id);
  const students = student.find((s) => s.id === id);

  if (!students) res.status(404).json({ error: "incorrect" });
  res.json(students);
});

app.listen(3000, () => {
  console.log("server is running");
});
