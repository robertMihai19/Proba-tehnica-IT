const mongoose = require("mongoose");
const Schema = mongoose.Schema

const EnrolemntSchema = new Schema({
    _id: Number,

    tutoring_class_id: {
        type: Number,
        required: true,
        trim: true
    },

    student_id: {
        type: mongoose.Schema.Types.String,
        default: [],
        ref: "accounts",
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("enrolments", EnrolemntSchema);