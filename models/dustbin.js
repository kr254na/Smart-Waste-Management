const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dustbinSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    latitude: {
        type:String,
        required:true
    },
    longitude: {
        type: String,
        required:true
    },
    filled: {
        type: [Number],
        required:true
    },
    address:{
        type:String
    },
    updatedAt: {
        type: Date
    }
});
module.exports.Dustbin = mongoose.model("Dustbin", dustbinSchema);