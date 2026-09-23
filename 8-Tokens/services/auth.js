const jwt = require("jsonwebtoken");
const secret = "Pavan123";
function setUser(user) {
  return jwt.payload(user, secret);
}

function getUser(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  setUser,
  getUser,
};
