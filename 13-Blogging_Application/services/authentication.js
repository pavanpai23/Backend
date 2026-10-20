const { createHmac, timingSafeEqual } = require("crypto");

const secret = process.env.JWT_SECRET || "development-only-change-me";
const tokenLifetimeSeconds = 60 * 60 * 24 * 7;

function sign(value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const unsignedToken = `v1.${encodedPayload}`;
  return `${unsignedToken}.${sign(unsignedToken)}`;
}

function validateToken(token) {
  if (typeof token !== "string") return null;
  const [version, encodedPayload, signature, extra] = token.split(".");
  if (version !== "v1" || !encodedPayload || !signature || extra) return null;

  const unsignedToken = `${version}.${encodedPayload}`;
  const expected = Buffer.from(sign(unsignedToken));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    if (!payload._id || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
