const Joi = require('joi');

exports.countryValidation = (data) => {
    const countrySchema = Joi.object({
      name: Joi.string(),
      flag: Joi.string()
    });
    return countrySchema.validate(data , {abortEarly: true});
}
