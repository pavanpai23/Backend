const express = require("express");
const { handlerUserSignUp, handlerUserLogin } = require("../controllers/user");
const router = express.Router();

router.post("/", handlerUserSignUp);
router.post("/login", handlerUserLogin);

module.exports = router;
