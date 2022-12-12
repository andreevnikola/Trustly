const bcrypt = require("bcryptjs");
const CRUD = require("./../db/db.js");

async function checkLoged(name, pass){
    let db = await new CRUD("trustly", "users");
    let exists = await db.Read({
        name: name
    });
    if(!exists){return [false, 1];}
    const cmp = await bcrypt.compare(pass, exists.password);
    if(!cmp){return [false, 2];}
    return [exists, null];
}

module.exports = { checkLoged };