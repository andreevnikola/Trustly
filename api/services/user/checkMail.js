const sendMail = require("./../../reuseble/sendMail").mail;
const fs = require('fs');

async function checkMail(req, res){
    try {
        let { name, mail } = req.params;

        json.mails.splice(json.mails.indexOf(mail), 1);

        let key = Math.floor(Math.random() * 999999999) + 1;

        let json = JSON.parse(fs.readFileSync('./globalData.json'));
        json.mails.push(mail);
        json.keys.push(key);
        fs.writeFileSync('./globalData.json', JSON.stringify(json));

        sendMail(mail, "Активирайте акаунта си! 📧 Trustly 📧", `
            <img width="250px" height="110px" src="https://res.cloudinary.com/dqpgstfsc/image/upload/v1670506494/logo_without_bg_sjcnxi.png", alt="Trustly logo"/>
            <br>
            <a href="http://localhost:4200/auth/verify?mail=${mail}&key=${key}&name=${name}"><h2>Активирайте акаунта си</h2></a>
            <p>Ако линка не работи, отворете този URL в браузера си: http://localhost:4200/auth/verify?mail=${mail}&key=${key}&name=${name}</p>
        `);

        res.send({
            error: false
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            error: "Server Error!"
        })
    }
}

module.exports = {checkMail};