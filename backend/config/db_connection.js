const mongoose = require("mongoose");


const mongoURI= require("./keys").mongoURI;
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
        // useCreateIndex: true
    })
    .then(() => console.log("MONGO CONNETED"))
    .catch((err) => console.log("MONGO ERR:" + err));