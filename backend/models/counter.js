const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Counter = new Schema({
    _id: {
        type: String,
        required: true
    },

    sequence_value: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("counter_users", Counter);