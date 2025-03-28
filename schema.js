const Joi = require('joi');

module.exports.userSchema=Joi.object({
        username: Joi.string().required(),
        email:Joi.string().required(),
        password:Joi.string().required().min(8),
        copassword: Joi.string().required().min(8),
    }).required();