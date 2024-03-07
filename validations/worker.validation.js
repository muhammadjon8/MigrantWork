const Joi = require("joi");

exports.workerValidation = (data) => {
  const workerSchema = Joi.object({
    first_name: Joi.string().pattern(new RegExp(`[a-zA-Z]+$`)).min(2).max(50),
    last_name: Joi.string().pattern(new RegExp(`[a-zA-Z]+$`)).min(2).max(50),
    birth_date: Joi.date().iso(),
    gender: Joi.string().valid("male", "female", "other"),
    passport: Joi.string().min(6),
    phone_number: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    email: Joi.string().email(),
    tg_link: Joi.string(),
    hashed_password: Joi.string(),
    confirm_password: Joi.string(),
    refresh_token: Joi.string(),

    is_active: Joi.boolean(),
    graduate: Joi.string(),
    skills: Joi.string(),
    experience: Joi.number(),
  });
  return workerSchema.validate(data, { abortEarly: true });
};
