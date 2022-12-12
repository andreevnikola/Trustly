const CRUD = require("./../../db/db.js");

async function checkNameExistense(req, res){
    try {
        let { name, oldName } = req.params;
        let db = await new CRUD("trustly", "users");
        let exists = await db.Read({
            name: name
        });
        if(exists && name !== oldName){
            res.status(200).send({
                error: "Потрбителското име е заето"
            });
            return
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { checkNameExistense };