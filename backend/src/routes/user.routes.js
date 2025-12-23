const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user.controller");

router.post("/", createUser);  // create user
router.get("/", getUsers);     // list users

module.exports = router;
