const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config({ path: "config.env" });

const DataBaseConnection = () => {
	mongoose
		.connect(process.env.MongoDB, {
			useNewUrlParser: true,
		})
		.then((data) => {
			console.log("MongoDb Connected ...");
		})
		.catch((err) => {
			console.log("Error:-  ", err);
		});
};

module.exports = DataBaseConnection;
