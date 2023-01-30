const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

const commentSchema = Joi.object({
    comment: Joi.string().required(),
    post: Joi.string().required()
});

module.exports = {
    postSchema,
    commentSchema
}