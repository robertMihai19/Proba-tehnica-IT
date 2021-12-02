const express = require("express");
const route = express.Router();
const {getValueForNextSequence, insertCounter, findId} = require("./../config/generateId");
const User = require("./../models/user");
const ActiveSession = require("./../models/activeSession");
const clasa = require("./../models/tutoring_classes");
const {parse} = require("nodemon/lib/cli");

route.post("/tutoring-classes", async (req, res) => {
    try {
        const {token} = req.headers;
        const {description, subject} = req.body;
        const user_session = await ActiveSession.findOne({token: token});
        if (user_session) {
            const user = await User.findById(user_session.userId);
            if (user.role === "teacher") {
                const id = await findId("classes_id");
                await clasa.create({
                    _id: id,
                    description: description,
                    teacher_id: user_session.userId,
                    subject: subject
                });
                res.json("Succes");
            } else res.json("Status 403");
        } else
            res.json("Utilizatorul nu este logat");
    } catch (error) {
        res.json("STATUS 400");
    }
})


route.get("/tutoring-classes", async (req, res) => {
    try {
        const filter = req.query;
        const teachClass = await clasa.find(filter, {
            _id: 1,
            description: 1,
            teacher_id: 1,
            subject: 1
        });
        res.json(teachClass);
    } catch (err) {
        res.json("Status 400");

    }
})

route.get("/tutoring-classes/:id", async (req, res) => {
    try {
        const teachClass = await clasa.findById(req.params.id, {_id: 1, description: 1, teacher_id: 1, subject: 1});
        if (teachClass)
            res.json(teachClass);
        else res.json("Status 403");
    } catch (err) {
        res.json("Status 400");

    }
})

route.patch("/tutoring-classes/:id", async (req, res) => {
    try {
        const {token} = req.headers;
        const userSession = await ActiveSession.findOne({token: token});
        const teachClass = await clasa.findById(req.params.id);
        if (teachClass) {
            if (req.body.subject || req.body.user_id) {
                res.json("Status 400");
            } else if (teachClass.teacher_id !== userSession.userId) {
                res.json("Userul logat nu a creat aceasta clasa");
            } else {
                await clasa.findByIdAndUpdate(req.params.id, req.body);
                res.json("Element updatat cu succes");
            }
        } else res.json("Status 404");
    } catch (err) {
        res.json("Status 404");
    }
})

route.delete("/tutoring-classes/:id", async (req, res) => {
    const {id} = req.params
    const {token} = req.headers
    const teachClass = await clasa.findById(id);
    if (teachClass) {
        const checkLog = await ActiveSession.findOne({token: token});
        if (checkLog.userId === teachClass.teacher_id) {
            await clasa.findByIdAndDelete(req.params.id);
            res.json("Succes");
        }
        res.json("Acest utilizator nu poate sterge aceasta clasa deoarece nu el a creat-o");
    }
    res.json("Status 404")
})

module.exports = route;