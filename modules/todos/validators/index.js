const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string(),
    completed: Joi.string()
});

module.exports = {
    todoSchema
}