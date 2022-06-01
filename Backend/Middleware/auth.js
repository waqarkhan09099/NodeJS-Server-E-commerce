const jwt = require("jsonwebtoken");
const user = require("../Model/UserModel");
const dotenv = require("dotenv");
const catchAsyncFunc = require("../Middleware/catchAsyncFunc");

dotenv.config({ path: "/Config/config.env" });
exports.userIsAuthenticate = catchAsyncFunc(async (req, res, next) => {
	const { token } = req.cookies;
	console.log(req.cookies);
	if (!token) {
		res.status(400).json({ success: true, message: "Token is not founded" });
	}

	const userVerify = jwt.verify(token, process.env.SECRET_TOKEN);
	console.log(userVerify.id);
	req.user = await user.findById(userVerify.id);

	next();
});

exports.roleAuthentication = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			return res.status(404).send("Role athentication error");
		}
		next();
	};
};
