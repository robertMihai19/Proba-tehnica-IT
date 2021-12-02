const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sequencing = require("./counter");

const Contact = new Schema({

    _id: Number,

    name: {
        type: String,
        require: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true
    },

    message: {
        type: String,
        require: true,
        trim: true
    },

    is_resolved: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("contact", Contact);