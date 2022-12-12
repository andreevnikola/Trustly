const CRUD = require("../db/db.js");

async function generateKey(name){
    let db = await new CRUD("trustly", "users");
    let key = Math.floor(Math.random() * 999999999999) + 1;
    key = key.toString();
    let res = await db.Update(
        {
            name: name
        },
        {
            $set: { key: key }
        }
    );
    return key;
}

module.exports = { generateKey };