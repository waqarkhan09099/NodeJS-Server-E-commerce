const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";
	// Wrong mongodb id Error
	if (err.name === "CastError") {
		const message = `Resource not found. Invalid: ${err.path}`;
		new ErrorHandler(message, 400);
	}
	// Mongoose dublicate key error
	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
		new ErrorHandler(message, 400);
	}
	// Wrong Jwt Error
	if (err.name === "JsonWebTokenError") {
		const message = `Json web token is valid, try again`;
		new ErrorHandler(message, 400);
	}
	// Jwt token expire error
	if (err.name === "TokenExpiredError") {
		const message = `Json web token expired please try again `;
		new ErrorHandler(message, 400);
	}
	res.status(err.statusCode).json({
		succes: false,
		message: err.message,
	});
};
