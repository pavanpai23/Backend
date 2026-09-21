const express = require("express");
const {
  handleGetAllUsers,
  handleGetAllUsersById,
  handleUpdateUsersById,
  handleDeleteUsersById,
  handleCreateNewUser,
} = require("../controller/user");
const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

//below all thing like get,post,patch,delete is return in one single route statement
router
  .route("/:id")
  .get(handleGetAllUsersById)
  .patch(handleUpdateUsersById)
  .delete(handleDeleteUsersById);

module.exports = router;
