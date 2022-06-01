const express = require("express");
const {
	userIsAuthenticate,
	roleAuthentication,
} = require("../Middleware/auth");
const {
	getAllProducts,
	createProduct,
	updateProducts,
	deleteProducts,
	getProductDetails,
} = require("../Controller/productController");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
	.route("/products/new")
	.post(userIsAuthenticate, roleAuthentication("user"), createProduct);
router
	.route("/products/:id")
	.put(userIsAuthenticate, roleAuthentication("user"), updateProducts)
	.delete(userIsAuthenticate, roleAuthentication("user"), deleteProducts)
	.get(getProductDetails);

module.exports = router;
