require("./config/db_connection");
const express = require("express");
const bodyParser = require("body-parser");
const contact = require("./routes/users");
const account = require("./routes/accounts");
const review = require("./routes/review");
const clasa = require("./routes/classes");
const enrolment = require("./routes/enrolment");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", contact);
app.use("/api", account);
app.use("/api", review);
app.use("/api", clasa);
app.use("/api", enrolment);


app.listen(3000);