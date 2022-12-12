const bcrypt = require("bcryptjs");
const CRUD = require("./../../db/db.js");
const { generateKey } = require('./../../reuseble/generateUserKey');
const sendMail = require("./../../reuseble/sendMail").mail;
const fs = require('fs');

async function activateMail(req, res) {
    let db = await new CRUD("trustly", "users");
    
    try {
        let { mail, key, name } = req.params;
        let json = JSON.parse(fs.readFileSync('./globalData.json'));
        if(json.mails.includes(mail) && json.keys.includes(parseInt(key))){
            json.mails.splice(json.mails.indexOf(mail), 1);
            json.keys.splice(json.keys.indexOf(key), 1);
            let db = await new CRUD("trustly", "users");
            await db.Update({name: name},{$set: {
                activated: true
            }});
            res.status(200).send({
                error: false
            });
        }else{
            throw "";
        }
        fs.writeFileSync('./globalData.json', JSON.stringify(json));
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Нещо се обърка!"
      });
    }
}

module.exports = {activateMail};