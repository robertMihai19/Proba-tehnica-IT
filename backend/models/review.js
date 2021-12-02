const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DB = new Schema({
    _id: Number,
    message: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("reviews", DB);