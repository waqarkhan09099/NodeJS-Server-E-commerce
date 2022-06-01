const ProductModel = require("../Model/ProductSchema");
const ApiFeatures = require("../utils/apiFeature");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncFunc = require("../Middleware/catchAsyncFunc");

exports.createProduct = catchAsyncFunc(async (req, res) => {
	const product = await new ProductModel(req.body);
	const savedProduct = product
		.save()
		.then((data) => {
			console.log(data);
			res.status(200).send({ success: true, data });
		})
		.catch((err) => {
			console.log("Catch Error:- ", err.errors.name);
			res.status(400).send({ success: false, Error: err.errors });
		});
});

const count = 2;
exports.getAllProducts = catchAsyncFunc(async (req, res, next) => {
	const productCount = await ProductModel.countDocuments();
	const apiFeature = new ApiFeatures(ProductModel, req.query)
		.search()
		.filter()
		.pagination(count);
	let products = await apiFeature.query;
	console.log(apiFeature);
	if (!apiFeature) {
		console.log("Api Error ////,,");
		// res.status(404).json({ message: "Products not Founded" });
		return next(ErrorHandler("Products not Founded", 404));
	}

	res.status(200).json({ success: true, data: products, productCount });
});

exports.updateProducts = async (req, res, next) => {
	const productId = await ProductModel.findById(req.params.id);
	if (!productId) {
		res.status(404).json({ success: true, message: "Product Id not founded" });
		// return next(ErrorHandler("Product not founded", 404));
	}
	const productUpdate = await ProductModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true, runValidators: true, useFindAndModify: false }
	);
	res.status(200).json({ success: true, productUpdate });
};

exports.deleteProducts = async (req, res) => {
	const productId = await ProductModel.findById(req.params.id);
	if (!productId) {
		res.status(404).json({ success: true, message: "Product not founded" });
		// return next(ErrorHandler("Product not founded", 404));
	}
	const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
	res.status(200).send("Product are deleted.....");
};

exports.getProductDetails = async (req, res) => {
	const productId = await ProductModel.findById(req.params.id);
	console.log(productId);
	if (!productId) {
		res.status(404).json({ success: true, message: "Product Id not founded" });
		// return next(new ErrorHandler("Product not founded", 404));
	}
	res.status(200).json({ success: true, data: productId });
};
