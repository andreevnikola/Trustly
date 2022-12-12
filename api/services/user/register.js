const bcrypt = require("bcryptjs");
const CRUD = require("./../../db/db.js");

async function Register(req, res) {
  let salt = await bcrypt.genSalt(4);
  let db = await new CRUD("trustly", "users");

  try {
    let { name, pass, mail } = req.params;
    let hashedPass = await bcrypt.hash(pass, salt);
    let result = await db.Read({
      name: name,
    });
    if (result) {
      res.status(200).send({
        error: "Потребителското име е заето!",
      });
    } else {
      let key = Math.floor(Math.random() * 999999999999) + 1;
      key = key.toString();
      let result = await db.Create({
        name: name,
        password: hashedPass,
        mail: mail,
        key: key
      });
      console.log(
        "New user is added with _id: " +
          result.insertedId +
          " and name: " +
          name
      );
      res.status(200).send({
        error: false,
        id: result.insertedId,
        key: key,
        mail: mail,
        name: name
      });
    }
  } catch (error) {
    console.log("Error registering user: " + error);
    res.status(500).send();
  }
}

module.exports = {Register};