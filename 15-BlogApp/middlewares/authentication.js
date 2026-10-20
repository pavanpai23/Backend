const { validateToken } = require("../services/authentication");

function checkForAuthenticateCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies?.[cookieName];
    if (!tokenCookieValue) return next();

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      res.clearCookie(cookieName);
    }
    next();
  };
}

function requireAuthentication(req, res, next) {
  if (!req.user) return res.redirect("/user/signin");
  next();
}

function validateRequestOrigin(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) return next();
  try {
    const parsedOrigin = new URL(origin);
    if (["http:", "https:"].includes(parsedOrigin.protocol) && parsedOrigin.host === req.get("host")) return next();
  } catch (error) {}
  return res.status(403).send("Request origin is not allowed.");
}

module.exports = {
  checkForAuthenticateCookie,
  requireAuthentication,
  validateRequestOrigin,
};
