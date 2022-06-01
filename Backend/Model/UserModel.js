const mongoose = require("mongoose");
const crypto = require("crypto");
const bycrypt = require("bcryptjs");
const dotenv = require("dotenv");
const validators = require("validator");
const jwt = require("jsonwebtoken");
// const { default: isEmail } = require("validator/lib/isemail");

const userModel = new mongoose.Schema({
	name: {
		type: String,
		min: 3,
		max: 30,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: validators.isEmail,
	},
	password: {
		type: String,
		required: true,
		min: 6,
		// select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		image_uri: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: "user",
	},

	// user: {
	// 	type: mongoose.Schema.ObjectId,
	// 	required: true,
	// },
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

// this fucntion is use to encrypt password before save user data in database

userModel.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bycrypt.hash(this.password, 10);
});

// Now we generate token after register and also set expire time

dotenv.config({ path: "Config/config.env" });

// exports.comparePassword = async function (password) {
// 	return await bycrypt.compare(password, this.password);
// };

// userModel.methods.getJWTToken = function () {
// 	return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN, {
// 		expiresIn: process.env.EXPIRE_TOKEN,
// 	});
// };

userModel.methods.resetPasswordFunc = function () {
	const randomKey = crypto.randomBytes(20).toString("hex");
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(randomKey)
		.digest("hex");
	console.log(this.resetPasswordToken);
	this.resetPasswordExpire = Date.now() * 15 * 60 * 1000;
	return this.resetPasswordToken;
};

module.exports = new mongoose.model("User", userModel);
