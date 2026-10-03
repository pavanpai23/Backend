const express = require("express");

const app = express();

app.use(express.json());
let students = [
  { id: 1, name: "pavan", branch: "ise" },
  { id: 2, name: "kassj", branch: "cse" },
];

app.get("/students", (req, res) => {
  console.log("get req");
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const user = students.find(
    (students) => students.id === Number(req.params.id),
  );
  if (!user) return res.status(404).json({ msg: "error" });
  res.json(user);
});

app.post("/students", (req, res) => {
  const { name, branch } = req.body;
  let newstudent = {
    id: students.length + 1,
    name,
    branch,
  };
  students.push(newstudent);

  res.status(201).json(newstudent);
});

app.delete("/students/:id", (req, res) => {
  const user = students.findIndex(
    (students) => students.id === Number(req.params.id),
  );
  if (user === -1) {
    return res.status(404).json({ msg: "error" });
  }
  const deletedstudent = students.splice(user, 1);
  return res.json(deletedstudent);
});

app.put("/students/:id", (req, res) => {
  const index = students.findIndex(
    (students) => students.id === Number(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({ msg: "error" });
  }

  const { name, branch } = req.body;

  students[index] = {
    id: students[index].id,
    name,
    branch,
  };
  return res.json(students[index]);
});

console.log(students);
app.listen(3000, () => {
  console.log("server running on port 3000");
});
