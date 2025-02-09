const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
    name:{
        type: String,
        required: [true,'Name not provided'],
        minlength: [3,'Name must have minimum of 3 letters'],
        maxlength: [50,'Name exceeded maximum length of 50 characters']
    },
    rating: {
        type: Number,
        min: [1,'Rating must be greater than 0'],
        max: [5,'Rating cannot exceed 5 '],
        default:1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    feedback: {
        type: String,
        required: [true,'Feedback not provided'],
        maxlength: [50,'Feedback exceeded maximum length of 50 characters']
    },
    });
module.exports.Feedback = mongoose.model("Feedback", feedbackSchema);