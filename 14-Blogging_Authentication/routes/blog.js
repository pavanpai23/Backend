const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { randomBytes } = require("crypto");

const Blog = require("../modules/blog");
const { requireAuthentication } = require("../middlewares/authentication");

const router = Router();

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const extension = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" }[file.mimetype];
    cb(null, `${randomBytes(16).toString("hex")}${extension}`);
  },
});

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    if (!allowedImageTypes.has(file.mimetype)) return cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
    cb(null, true);
  },
});

router.get("/add-new", requireAuthentication, (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  }); 
});

router.post("/", requireAuthentication, upload.single("CoverImage"), async (req, res, next) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  if (!title || title.length > 200 || !body || body.length > 50000) {
    return res.status(400).send("Title and body are required (maximum 200 and 50,000 characters).");
  }
  try {
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    ...(req.file && { coverImageUrl: `/images/${req.file.filename}` }),
  });
  return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    return next(error);
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message?.startsWith("Only JPEG")) {
    return res.status(400).send(error.message);
  }
  return next(error);
});

module.exports = router;
