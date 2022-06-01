const Joi = require("joi");

exports.RegisterValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(30).required(),
		email: Joi.string().email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net"] },
		}),
		password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
	});

	return schema.validate(data);
};

exports.LoginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.min(6)
			.required(),
		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};
