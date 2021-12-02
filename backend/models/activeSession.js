const mongoose = require('mongoose');

const activeSessionSchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const activeSeesion = mongoose.model('ActiveSessions', activeSessionSchema);

module.exports = activeSeesion;