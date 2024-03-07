const Joi = require("joi");

exports.employerValidation = (data) => {
  const employerSchema = Joi.object({
    company_name: Joi.string(),
    industry: Joi.string(),
    country_id: Joi.number().integer(),
    address: Joi.string(),
    location: Joi.string(),
    contact_name: Joi.string(),
    contact_passport: Joi.string().min(6),
    contact_email: Joi.string().email(),
    contact_phone: Joi.string().pattern(
      new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
    ),
    hashed_password: Joi.string(),
    confirm_password: Joi.string(),
    refresh_token: Joi.string(),
  });
  return employerSchema.validate(data, { abortEarly: true });
};
