module.exports = (theFunc) => (req, res, next) => {
	Promise.resolve(theFunc(req, res, next)).catch((err) => {
		console.log("CatchError:- ", err);
		res.status(500).json({
			success: false,
			error: err,
		});
	});
};
