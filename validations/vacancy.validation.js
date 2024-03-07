const Joi = require("joi");

exports.vacancyValidation = (data) => {
  const vacancySchema = Joi.object({
    employer_id: Joi.number().integer(),
    city: Joi.string(),
    job_id: Joi.number().integer(),
    salary: Joi.number().integer(),
    description: Joi.string(),
    requirements: Joi.string(),
    internship: Joi.boolean(),
    job_type: Joi.string().valid("part-time", "full-time", "freelance"),
    work_hour: Joi.string(),
    medicine: Joi.boolean(),
    housing: Joi.boolean(),
    gender: Joi.string().valid("male", "female"),
    age_limit: Joi.number().integer(),
    graduate: Joi.boolean().valid("Yes", "No"),
    experience: Joi.string(),
    trial_period: Joi.boolean(),
  });
  return vacancySchema.validate(data, { abortEarly: true });
};
