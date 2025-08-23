const express = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/")
  .get(getUsers)     // GET all users
  .post(createUser); // POST new user

router.route("/:id")
  .get(getUserById)   // GET user by id
  .put(updateUser)    // PUT update user
  .delete(deleteUser); // DELETE user

module.exports = router;
