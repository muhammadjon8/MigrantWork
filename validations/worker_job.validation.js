const Joi = require("joi");

exports.workerJobValidation = (data) => {
  const workerJobSchema = Joi.object({
    worker_id: Joi.number().integer(),
    job_id: Joi.number().integer(),
  });
  return workerJobSchema.validate(data, { abortEarly: true });
};
