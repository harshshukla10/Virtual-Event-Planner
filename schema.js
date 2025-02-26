const Joi = require('joi');

module.exports.userSchema=Joi.object({
        email:Joi.string().required(),
        password:Joi.string().required().min(8),
        copassword: Joi.string().required().min(8),
    }).required();