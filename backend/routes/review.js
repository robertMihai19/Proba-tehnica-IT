const express = require("express");
const route = express.Router();

const review = require("./../models/review");
const user = require("./../models/user");
const activeSession = require("./../models/activeSession");
const {getValueForNextSequence, insertCounter, findId} = require("./../config/generateId");

route.post("/reviews", async (req, res) => {
    try {
        const {token} = req.headers;
        const {message} = req.body
        if (message.length <= 500) {
            const checkLog = await activeSession.findOne({token: token});
            if (checkLog) {
                const utilizator = await user.findById(checkLog.userId);
                if (utilizator) {
                    const id = await findId("review_id");
                    await review.create({_id: id, message: message, user_id: checkLog.userId});
                }
            } else res.json("Utilizatorul nu e logat");
        }
        res.status(200).json("Mesajul a fost postat cu succes");
    } catch (error) {
        res.status(500).json({error: "Status 400"})
    }
});

route.get("/reviews", async (req, res) => {
    try {
        const mesaje = await review.find({}, {message: 1, user_id: 1});
        res.status(200).json(mesaje);
    } catch (error) {
        res.status(500).json({error: "STATUS 400"});
    }
})

route.get("/reviews/:id", async (req, res) => {
    try {
        const mesaje = await review.find({_id: req.params.id}, {message: 1, user_id: 1});
        if (mesaje.length)
            res.status(200).json(mesaje);
        else res.json("Status 404");
    } catch (error) {
        res.status(500).json({error: "STATUS 400"});
    }
})

route.patch("/reviews/:id", async (req, res) => {
    try {
        const {token} = req.headers;
        const id = req.params.id;
        const {message} = req.body;
        const checkLog = await activeSession.findOne({token: token});
        const checkReview = await review.findById(id);
        if (checkReview) {
            if (checkReview.user_id === checkLog.userId) {
                await review.findByIdAndUpdate(id, {message: message});
                res.status(200).json({message: "SUCCES"});
            } else res.json("Utilizatorul nu a postat acel mesaj!");
        } else res.json("Status 404");
    } catch (error) {
        res.status(500).json({error: "STATUS 400"});
    }
})

route.delete("/reviews/:id", async (req, res) => {
    try {
        const {token} = req.headers;
        const id = req.params.id;
        const find_review = await review.findById(id);
        const checkLog = await activeSession.findOne({token: token});
        if (checkLog) {
            if (find_review) {
                if (find_review.user_id === checkLog.userId) {
                    await review.findByIdAndDelete(id);
                    res.status(200).json({message: "SUCCES"});
                } else res.json("Userul logat nu a creat acest review!");
            } else res.json("Status 404");
        }
        res.json("Utilizatorul nu este logat");
    } catch (error) {
        res.status(500).json({error: "STATUS 400"});
    }
})


module.exports = route;