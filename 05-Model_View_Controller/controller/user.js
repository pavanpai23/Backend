const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
}

async function handleGetAllUsersById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).json({ error: "no user found" });
  return res.json(user);
}

async function handleUpdateUsersById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "changed" });
  return res.json({
    status: "success",
  });
}

async function handleDeleteUsersById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({
    status: "success",
  });
}

async function handleCreateNewUser(req, res) {
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

  return res.status(201).json({ msg: "success", id: result._id });
}
module.exports = {
  handleGetAllUsers,
  handleGetAllUsersById,
  handleUpdateUsersById,
  handleDeleteUsersById,
  handleCreateNewUser,
};
