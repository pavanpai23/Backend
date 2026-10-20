const JWT = require("jsonwebtoken");

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("Set JWT_SECRET to at least 32 characters.");
  return secret;
}

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, getSecret(), { expiresIn: "7d" });
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, getSecret());
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
