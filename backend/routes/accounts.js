const router = require("express").Router();
const bcrypt = require('bcrypt');
const user = require("./../models/user");
const activeSession = require("./../models/activeSession");
const review = require("./../models/review");
const clasa = require("./../models/tutoring_classes");
const enroll = require("./../models/enrolments");
const {findId} = require("./../config/generateId");
const jwt = require("jsonwebtoken");
const config = require("./../config/keys");

async function validateEmail(emailAdress, role) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail) && emailAdress.length <= 50) {
        if ((emailAdress.includes("@onmicrosoft.upb.ro") && role === "teacher") || (emailAdress.includes("@stud.upb.ro") && role === "student")) {
            const checkUser = await user.findOne({email: emailAdress});
            return !checkUser
        } else return false;
    } else {
        return false;
    }
}

router.post("/auth/register", async (req, res) => {
    const {email, firstname, lastname, password, confirmation_password, role} = req.body;

    if (await validateEmail(email, role) && firstname.length <= 50 && lastname.length <= 50 && password === confirmation_password && password.length >= 8) {
        const salt = await bcrypt.genSalt(10);
        const parola = await bcrypt.hash(password, salt);
        const id = await findId("account_id");
        const cont = {_id: id, firstname: firstname, lastname: lastname, email: email, password: parola, role: role};
        user.create(cont, (err) => {
            if (err) {
                res.status(500).send("Status 400");
            }
            res.status(200).send("Account has been created");
        })
    } else res.status(200).send("Status 400");
});

router.post("/auth/login", async (req, res) => {
        try {
            const body = req.body;
            const utilizator = await user.findOne({email: body.email});
            if (utilizator) {
                const validPassword = await bcrypt.compare(body.password, utilizator.password);
                if (validPassword) {
                    const log_in_user = await activeSession.findOne({userId: utilizator._id});
                    if (!log_in_user) {
                        const token = jwt.sign({utilizator}, config.secret, {expiresIn: '2h'});
                        const session = {token: token, userId: utilizator._id};
                        activeSession.create(session, function (err, resp) {
                            res.json("Autentificare cu succes!");
                        })
                    } else res.json("Status 401");
                } else {
                    res.status(400).json("Status 400");
                }
            } else {
                res.status(401).json({error: "User does not exist"});
            }

        } catch
            (error) {
            res.status(500).send("Status 400");
        }
    }
)
;

router.post("/auth/logout", async (req, res) => {
    try {
        const {token} = req.headers;
        const userSession = await activeSession.findOne({token: token});
        await activeSession.findByIdAndDelete(userSession);
        res.json("Utilizatorul a fost delogat cu succes!");
    } catch (error) {
        res.json("Status 400");
    }

})

router.get("/users", async (req, res) => {
    try {
        const utilizatori = await user.find({}, {firstname: 1, lastname: 1, email: 1, role: 1});
        res.status(200).json(utilizatori);
    } catch (error) {
        res.status(500).json({error: "Status 400"});
    }

})

router.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const utilizatori = await user.findOne({_id: id}, {firstname: 1, lastname: 1, email: 1, role: 1});
        if (utilizatori)
            res.status(200).json(utilizatori);
        else res.json("Status 404");
    } catch (error) {
        res.status(500).json({error: "Status 404"});
    }

})

router.patch("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {token} = req.headers;
        const checkLog = await activeSession.findOne({token: token});
        if (checkLog.userId === parseInt(id, 10)) {
            const update = req.body;
            if (update.password) {
                {
                    if (update.password === update.confirmation_password) {
                        const salt = await bcrypt.genSalt(10);
                        const parola = await bcrypt.hash(update.password, salt);
                        update.password = parola;
                    } else {
                        res.status(500).json({error: "Status 400"});
                        ret;
                    }
                }
            }
            try {
                const utilizator = await user.findById(id);
                let ok = true;
                if (update.email) {
                    if (update.role) {
                        ok = await validateEmail(update.email, update.role);
                    } else {
                        ok = await validateEmail(update.email, utilizator.role);
                    }
                } else if (update.role) {
                    ok = await validateEmail(utilizator.email, update.role);
                }
                if (ok) {
                    await user.findByIdAndUpdate(id, update);
                    res.status(200).json({message: "Succes"});
                } else res.json("Status 404");
            } catch (error) {
                res.status(500).json({error: "Status 404"});
            }
        } else res.json("Status 403");

    } catch (error) {
        res.status(500).json({error: "Status 400"});
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
        const {token} = req.headers;
        const checkLog = await activeSession.findOne({token: token});
        const id = req.params.id;
        if (checkLog.userId === parseInt(id, 10)) {
            const review_uri = await review.find({user_id: id});
            for (let i = 0; i < review_uri.length; i++) {
                await review.findByIdAndDelete(review_uri[i]);
            }
            const clase = await clasa.find({teacher_id: id});
            for (let i = 0; i < clase.length; i++) {
                const inrolari = await enroll.find({tutoring_class_id: clase[i]._id});
                for (let j = 0; j < inrolari.length; j++)
                    await enroll.findByIdAndDelete(inrolari[j]);
                await clasa.findByIdAndDelete(clase[i]);
            }
            const inrolari = await enroll.find({student_id: id});
            for (let i = 0; i < inrolari.length; i++) {
                console.log(inrolari[i]);
                await enroll.findByIdAndDelete(inrolari[i]);
            }

            await user.findByIdAndDelete(req.params.id);
            await activeSession.findByIdAndDelete(checkLog);
            res.status(500).send("Succes");
        } else res.json("Status 404");
    } catch (error) {
        res.status(500).send({error: "Status 404"});
    }
})

module.exports = router;