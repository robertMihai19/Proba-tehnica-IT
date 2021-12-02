const router = require("express").Router();
const user = require("./../models/contact");
const {findId} = require("./../config/generateId");
const {json} = require("express");
const {trimiteMail} = require("./../config/nodemaill");

function validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
}

router.post("/contact-requests", async (req, res) => {
    try {
        const persoana = req.body;

        if (persoana.name && persoana.email && persoana.message) {
            if (`${persoana.name.length}` <= 50 && `${persoana.email.length}` <= 50 && `${persoana.message.length}` <= 5000) {
                if (validateEmail(persoana.email)) {
                    persoana._id = await findId("user_id");
                    user.create(persoana, (err, user) => {
                        if (err) {
                            res.json("Status 400");
                        } else {
                            trimiteMail(persoana.email, persoana.name, persoana.message);
                            res.json("Utilizator creat cu succes!");
                        }
                    })
                } else res.json("Status 400");
            } else res.json("Status 400");
        } else
            res.json("Status 400");
    } catch (error) {
        res.json("STATUS 400");
    }
});

router.get("/contact-requests", async (req, res) => {
    const {sortBy, order, filterBy} = req.query;
    if (!sortBy && !order && !filterBy) {
        user.find({}, async (error, utilizatori) => {
            if (error) {
                res.json("Nope");
            }
            res.json(utilizatori);
        });
    } else if (sortBy && order) {
        user.find({}).sort({[sortBy]: (order == "ASC" ? 1 : -1)}).exec((err, doc) => {
            res.json(doc);
        });
    } else {
        user.find(JSON.parse(filterBy), (err, doc) => {
            res.json(doc);
        })
    }
});

router.get("/contact-requests/:id", async (req, res) => {
    const id = req.params.id
    const utilizator = await user.findById(id);
    if (utilizator)
        res.status(200).send(`${utilizator}`);
    else res.status(500).send("Status 404");
});


router.delete("/contact-requests/:id", async (req, res) => {
    try {
        const id = req.params.id
        const utilizator = await user.findByIdAndDelete(id);
        if (!utilizator)
            res.json("Status 404");
        else res.json("Utilizator sters");
    } catch (error) {
        res.json("Status 404");
    }
})

router.patch("/contact-requests/:id", async (req, res) => {
    const id = req.params.id;
    const update = req.body;
    const newUser = await user.findById(id);
    if (newUser) {
        if (typeof update.is_resolved == "boolean") {
            await user.findByIdAndUpdate(id, {is_resolved: update.is_resolved});
            res.json("User updatat cu succes!");
        } else
            res.json("Status 404");
    } else
        res.json("Status 404");
})

module.exports = router;