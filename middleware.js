const { FeedbackSchema } = require('./schema.js');
const  expressError  = require('./utils/ExpressErrors.js');
module.exports.validateFeedback = (req, res, next) => {
    // Validate feedback data using Joi schema. If any data is missing or invalid, throw an error.
    let { error } = FeedbackSchema.validate(req.body);
    console.log(error);
    if (error) {
        throw new expressError(400, error.details.map((el) => el.message).join(","));
    }
    else {
        next();
    }
};