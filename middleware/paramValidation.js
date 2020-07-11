const Joi = require('@hapi/joi');
const ServerError = require('../utils/ServerError');

const PARAM_SCHEMA = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * get request's param for validation and Input sanitization.
 */
module.exports = (req, res, next) => {
  const { error } = PARAM_SCHEMA.validate({ id: req.params.id });
  if (error) throw next(new ServerError(error.details[0].message, 404));
  return next();
};
