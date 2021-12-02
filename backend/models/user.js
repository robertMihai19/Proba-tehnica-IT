const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({

    _id: Number,

    firstname: {
        type: String,
        require: true,
        trim: true
    },

    lastname: {
        type: String,
        require: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true
    },

    password: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },

    role: {
        type: String,
        require: true,
        trim: true,
        default: 'student',
        enum: ['teacher', 'student']
    }

})

const account = mongoose.model("accounts", User);
module.exports = account;