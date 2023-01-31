const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    phone: Joi.string().required(),
    website: Joi.string(),
    /* roles: Joi.array().items(Joi.object({
        // Object schema
    })) */
    roles: Joi.array().items(Joi.string()),
    company: Joi.object().keys({
        name: Joi.string().required(),
        catchPhrase: Joi.string(),
        bs: Joi.string()
    }),
    address: Joi.object().keys({
        street: Joi.string().required(),
        suite: Joi.string().required(),
        city: Joi.string().required(),
        zipcode: Joi.string().required(),
        geo: Joi.object().keys({
            lat: Joi.number().required(),
            long: Joi.number().required()
        })
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
}