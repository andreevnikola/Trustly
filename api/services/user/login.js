const bcrypt = require("bcryptjs");
const CRUD = require("./../../db/db.js");
const { generateKey } = require('./../../reuseble/generateUserKey');

async function Login(req, res) {
    let db = await new CRUD("trustly", "users");
    
    try {
      var { name, pass } = req.params;
      let result = await db.Read({
        name: name
      });
      if (result) {
        const cmp = await bcrypt.compare(pass, result.password);
        if(!cmp){
          res.status(200).send({
            error: "Сгрешено име или парола!",
          });
          return
        }
        console.log("User loged in to: " + result.name);
        let key = await generateKey(name);
        res.status(200).send({
          name: result.name,
          id: result._id.toString(),
          mail: result.mail,
          logo: result.logo,
          logo_id: result.logo_id,
          key: key,
          activated: result.activated
        });
      } else {
        res.status(200).send({
          error: "Сгрешено име или парола!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Нещо се обърка!",
      });
    }
}

module.exports = {Login};