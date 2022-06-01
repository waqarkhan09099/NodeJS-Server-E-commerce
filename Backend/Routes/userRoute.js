const userIsAuthenticate = require("../Middleware/auth");
const express = require("express");
const router = express.Router();
const {
	userRegister,
	userLogin,
	userLogout,
	userForgotPassword,
	resetPassword,
	userDetail,
} = require("../Controller/userController");

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/password/forgot").post(userForgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(userLogout);
router.route("/new").get(userIsAuthenticate, userDetail);

module.exports = router;
