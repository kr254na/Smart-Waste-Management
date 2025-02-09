const joi = require('joi');
module.exports.FeedbackSchema = joi.object({
        name: joi.string().min(3).max(50).required(),
        rating:joi.number().default(1).min(1).max(5),
        feedback: joi.string().max(50).required(),
});