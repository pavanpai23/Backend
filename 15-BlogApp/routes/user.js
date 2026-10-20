const { Router } = require("express");
const User = require("../modules/user");

const router = Router();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token, cookieOptions).redirect("/");
  } catch (error) {
    if (error.message === "user not found" || error.message === "incorrect password") {
      return res.status(401).render("signin", { error: "Invalid email or password." });
    }
    return next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined }).redirect("/");
});

router.post("/signup", async (req, res, next) => {
  const fullname = typeof req.body.fullname === "string" ? req.body.fullname.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body.password;
  if (fullname.length < 1 || fullname.length > 100 || !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== "string" || password.length < 12 || password.length > 256) {
    return res.status(400).render("signup", { error: "Enter a name, valid email, and password between 12 and 256 characters." });
  }
  try {
    await User.create({ fullname, email, password });
    return res.redirect("/user/signin");
  } catch (error) {
    if (error.code === 11000) return res.status(409).render("signup", { error: "An account with that email already exists." });
    return next(error);
  }
});

module.exports = router;
