const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../services/auth");

async function handlerUserSignUp(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });

  return res.render("home");
}

async function handlerUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.render("login", {
      error: "Invalid username and password",
    });
  }

  const token=setUser(user);
  res.cookie("uid", token);

  return res.redirect("/");
}

module.exports = {
  handlerUserSignUp,
  handlerUserLogin,
};
