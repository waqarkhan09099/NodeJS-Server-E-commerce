const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Enter Your Valid Name"],
		minLength: 4,
		trime: true,
	},
	description: {
		type: String,
		required: [true, "Please enter product description"],
	},
	price: {
		type: Number,
		required: [true, "please enter product price"],
		min: [100, "Minimum product price above 100"],
		maxLength: [8, "Maximum price length is 8"],
	},
	rating: {
		type: Number,
		default: 0,
	},
	image: [
		{
			uri: {
				type: String,
				required: [true, "Image is required to show your product"],
			},
		},
		{
			punlicID: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [true, "please enter product category"],
	},
	Stock: {
		type: Number,
		required: [true, "Please Enter Product Stock"],
		maxLenght: [10, "Your did not put stock above 10 lenght "],
		default: 1,
	},
	numofReviews: {
		type: Number,
		default: 0,
	},
	review: [
		{
			name: {
				type: String,
				required: true,
			},
			rating: {
				type: Number,
				required: true,
			},
			comment: {
				type: String,
				required: [true, "Enter your Comment"],
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Products", ProductSchema);
