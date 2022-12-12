const CRUD = require("./../../db/db.js");

async function checkLoged(req, res){
    try {
        let { key } = req.params;
        let db = await new CRUD("trustly", "users");
        let exists = await db.Read({
            key: key
        });
        if(!exists){
            res.status(200).send({
                error: "Key not found"
            });
            return;
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { checkLoged };