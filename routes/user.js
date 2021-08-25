const express = require("express");
const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/status", isAuth, userController.getUserStatus);

router.put("/status", isAuth, userController.updateStatus);

module.exports = router;
