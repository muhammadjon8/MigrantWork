const Joi = require("joi");

exports.adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp(`[a-zA-Z]+$`)).min(2).max(50),
    hashed_password: Joi.string().min(6),
    confirm_password: Joi.string().min(6),
    tg_link: Joi.string().min(6),
    refresh_token: Joi.string().min(6),
    description: Joi.string().min(6),
    phone_number: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    email: Joi.string().email(),
    is_active: Joi.boolean().default(false),
    is_creator: Joi.boolean().default(false),
  });
  return schema.validate(data, { abortEarly: true });
};
