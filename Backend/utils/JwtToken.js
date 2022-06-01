const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
module.exports.sendToken = (user, statusCode, res) => {
	dotenv.config({ path: "/Config/config.env" });

	const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
		expiresIn: process.env.EXPIRE_TOKEN,
	});
	const option = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	res.status(statusCode).cookie("token", token, option).json({
		success: true,
		user,
		token,
	});
};
