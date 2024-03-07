const Joi = require('joi');

exports.applicationValidation = (data) =>{
    const applicationSchema = Joi.object({
        vacancy_id: Joi.number().integer(),
        worker_id: Joi.number().integer(),
        application_date: Joi.date().iso(),
      });
    return applicationSchema.validate(data , {abortEarly:true});
}