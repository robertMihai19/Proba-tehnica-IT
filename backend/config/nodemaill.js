const nodemaill = require("nodemailer");

const transporter = nodemaill.createTransport({
    service: "hotmail",
    auth: {
        user: "probaTehnicaIt@hotmail.com",
        pass: ";>@:{tzH5,;_T8"
    }
});

function trimiteMail(email, name, message) {
    const options = {
        from: "probaTehnicaIt@hotmail.com",
        to: email,
        subject: "IT",
        text: "Salut " + name + "!\nContul a fost creat cu succes!\nMesajul dumneavoastra este: " + message
    }
    console.log(options);
    transporter.sendMail(options, (err, mail) => {
        if (err)
            console.log("ERROR", err);
        else consol.log(mail);
    })
}

module.exports = {trimiteMail: trimiteMail};
