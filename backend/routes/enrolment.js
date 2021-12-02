const express = require("express");
const router = express.Router();
const user = require("./../models/user");
const activeSession = require("./../models/activeSession");
const enrolment = require("./../models/enrolments");
const clasa = require("./../models/tutoring_classes");
const {getValueForNextSequence, insertCounter, findId} = require("./../config/generateId");

router.post("/tutoring-class/:id/enroll", async (req, res) => {
    const {token} = req.headers;
    const userLog = await activeSession.findOne({token: token});
    const student = await user.findById(userLog.userId);
    if (student.role === "student") {
        const teachClass = await clasa.findById(req.params.id);
        if (teachClass) {
            const id = await findId("enrolment_id")
            await enrolment.create({_id: id, tutoring_class_id: teachClass._id, student_id: student._id});
            res.json("Succes");
        } else res.json("Status 400");
    } else res.json("Status 403");
});

module.exports = router;