const mongoose = require("mongoose");

const TutoringSchema = new mongoose.Schema({

    _id: Number,

    description: {
        type: String,
        required: true,
        trim: true
    },

    teacher_id: {
        type: mongoose.Schema.Types.Number,
        trim: true
    },

    subject: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("tutoring_classes", TutoringSchema);