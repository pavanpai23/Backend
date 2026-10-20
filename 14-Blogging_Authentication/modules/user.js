const { createHmac, randomBytes, scryptSync, timingSafeEqual } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: /^\S+@\S+\.\S+$/,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      maxlength: 135,
    },
    profileImageUrl: {
      type: String,
      default: "./images/image.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  if (typeof this.password !== "string" || this.password.length < 12 || this.password.length > 256) {
    return next(new Error("Password must be between 12 and 256 characters."));
  }
  this.salt = randomBytes(16).toString("hex");
  this.password = `scrypt$${scryptSync(this.password, this.salt, 64).toString("hex")}`;
  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) throw new Error("user not found");

  if (typeof password !== "string" || password.length > 256) {
    throw new Error("incorrect password");
  }

  let valid = false;
  if (user.password.startsWith("scrypt$")) {
    const expected = Buffer.from(user.password.slice(7), "hex");
    if (expected.length === 64) {
      const actual = scryptSync(password, user.salt, 64);
      valid = timingSafeEqual(expected, actual);
    }
  } else {
    // Verify old course-example hashes once, then upgrade them to scrypt.
    const expected = Buffer.from(user.password, "hex");
    const actual = createHmac("sha256", user.salt).update(password).digest();
    valid = expected.length === 32 && timingSafeEqual(expected, actual);
    if (valid) {
      const salt = randomBytes(16).toString("hex");
      const upgraded = `scrypt$${scryptSync(password, salt, 64).toString("hex")}`;
      await this.updateOne({ _id: user._id }, { $set: { salt, password: upgraded } });
    }
  }
  if (!valid) throw new Error("incorrect password");

  const token = createTokenForUser(user);
  return token;
});

const User = model("User", userSchema);
module.exports = User;
