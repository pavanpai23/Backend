const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Youtube-app-1")
  .then(() => console.log("mongoDb connected"))
  .catch((err) => console.log("mongo err", err));

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

//middle ware is used because it helps to put form data inside a body also known as plugins
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("hello from middleware 2");
  next();
});

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}\n`,
    (err, data) => {
      next();
    },
  );
});

//Rest api
app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
});

//below all thing like get,post,patch,delete is return in one single route statement
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ error: "no user found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    //edit user with id
    await User.findByIdAndUpdate(req.params.id, { lastName: "changed" });
    return res.json({
      status: "success",
    });
  })
  .delete(async (req, res) => {
    //delete user with id
    await User.findByIdAndDelete(req.params.id);
    return res.json({
      status: "success",
    });
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.job_title ||
    !body.gender
  ) {
    res.status(400).json({ msg: "all fields are required" });
  }

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "created successfully" });
});

app.listen(PORT, () => console.log(`Server Stared at port: ${PORT}`));
