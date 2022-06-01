const express = require("express");
const dotenv = require("dotenv");
const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");
const cookie = require("cookie-parser");
// const ErrorHandler = require("./utils/ErrorHandler");
const ErrorMiddleware = require(".//utils/ErrorHandler");
const DataBaseConnection = require("./Config/DataBase");

const app = express();

process.on("uncaughtException", (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Uncaught Exception`);
	process.exit(1);
});

dotenv.config({ path: "Config/config.env" });
// DataBase connection Function
DataBaseConnection();

app.use(express.json());
app.use(cookie());

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("*", (req, res) => {
	res.send("Its Running").status(200);
});

const server = app.listen(process.env.Port, () => {
	console.log(`Server is running on : ${process.env.Port}`);
});

app.use(ErrorMiddleware);
// if dbbase is not connected we manually do server crash

process.on("unhandledRejection", (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Unhandled Promise Rejection`);

	server.close(() => {
		process.exit(1);
	});
});
