const catchAsyncFunc = require("../Middleware/catchAsyncFunc");
// const jwt = require("jsonwebtoken");
const jwtToken = require("../utils/JwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const UserModel = require("../Model/UserModel");
const dotenv = require("dotenv");
const {
	RegisterValidation,
	LoginValidation,
} = require("../Validation/JoiValidation");
const bcrypt = require("bcrypt");
const { response } = require("express");
exports.userRegister = catchAsyncFunc(async (req, res, next) => {
	const { name, email, password } = req.body;
	const { error } = RegisterValidation({
		name,
		email,
		password,
	});
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	const userExist = await UserModel.findOne({ email: email });
	if (userExist) {
		return res
			.status(400)
			.send("This Email is already exits, please enter unique email.");
	}
	// const salt = await bcrypt.genSalt(10);
	// const hashPass = await bcrypt.hash(password, salt);
	const User = await UserModel.create({
		name,
		email,
		password,
		avatar: {
			public_id: "this is a sample Public ID",
			image_uri: "Example image",
		},
	});
	const userSaved = User.save()
		.then((data) => jwtToken.sendToken(User, 200, res))
		.catch((err) => {
			console.log(err);
			res.status(400).json({
				success: true,
				data: err,
			});
		});

	// res.status(200).json({ success: true, token: token });
});

dotenv.config({ path: "Config/config.env" });

exports.userLogin = catchAsyncFunc(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email: email });
	// const token = jwt.sign({ _id: user.id }, process.env.SECRET_TOKEN, {
	// 	expiresIn: process.env.EXPIRE_TOKEN,
	// });
	const { error } = LoginValidation({
		email,
		password,
	});
	const UserLogin = await UserModel.findOne({ email: email }).select(
		"+password"
	);
	const decryptedPass = bcrypt.compareSync(password, UserLogin.password);
	console.log(decryptedPass);
	if (error) {
		// return next(new ErrorHandler("Login not valid", 400));
		return res.status(400).send(error.details[0].message);
	}

	if (!decryptedPass) {
		res.status(400).send("Password Must Be Correct/...");
	}
	jwtToken.sendToken(user, 200, res);
});

exports.userLogout = catchAsyncFunc(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.status(200).json({
		success: true,
		message: "Logged Out",
	});
});

exports.userForgotPassword = catchAsyncFunc(async (req, res, next) => {
	const { email } = req.body;
	const user = await UserModel.findOne({ email: email });

	if (!user) {
		res.status(404).json({ success: false, message: "Email not Founded" });
	}

	const resetToken = user.resetPasswordFunc();

	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/reset/${resetToken}`;

	const message = `your password reset token is :- \n \n ${resetUrl} \n\nif you have not requeset this email then, please ignore it`;
	console.log(message);
	try {
		await sendEmail({
			email: user.email,
			subject: "Ecommerce Password Recovery",
			message,
		});
		res.status(200).json({
			success: true,
			message: `Email send to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		await res.status(404).send("reset password Error....");
	}
});

exports.resetPassword = catchAsyncFunc(async (req, res, next) => {
	const user = await UserModel.findOne({
		resetPasswordToken: req.params.token,
		// resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "user token not founded" });
	}

	if (req.body.password !== req.body.confirmPassword) {
		return res.status(400).json({
			success: false,
			message: "password does not match",
		});
	}
	await user.updateOne(
		{ resetPasswordToken: req.params.token },
		{ password: req.body.password },
		(err) => {
			console.log("Error:--", err);
		}
	);
	// user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();
	jwtToken.sendToken(user, 200, res);
});

exports.userDetail = catchAsyncFunc(async (req, res, next) => {
	const userInfo = await UserModel.findById({ id: user._id });
	console.log(userInfo);
	res.status(200).json({
		success: true,
		data: userInfo,
	});
});
