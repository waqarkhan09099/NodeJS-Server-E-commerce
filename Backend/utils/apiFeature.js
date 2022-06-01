class ApiFeature {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	search() {
		const keyword = this.queryStr.keyword
			? {
					name: {
						$regex: this.queryStr.keyword,
						$options: "i",
					},
			  }
			: {};
		this.query = this.query.find({ ...keyword });
		return this;
	}
	filter() {
		const copyqueryStr = { ...this.queryStr };
		const removeFields = ["keyword", "page", "limit"];

		removeFields.forEach((item) => delete copyqueryStr[item]);
		let queryStr = JSON.stringify(copyqueryStr);
		// filter price lessthan or greater than query
		queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (key) => `$${key}`);
		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}
	pagination(currentPagination) {
		let pagination = Number(this.queryStr.page) || 1;

		let skip = currentPagination * (pagination - 1);
		if (!currentPagination < skip) {
			this.query = this.query.limit(currentPagination).skip(skip);
			return this;
		} else {
			return this;
		}
	}
}

exports.searchFeature = (product, query) => {
	const keyword = query.keyword
		? { name: { $regex: query.keyword, $options: "i" } }
		: {};
	product = product.find({ ...keyword });
	return product;
};

module.exports = ApiFeature;
