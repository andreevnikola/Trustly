const CRUD = require("./../../db/db.js");

async function getAllChalanges(req, res){
    try {
        let creators = [];
        let db = await new CRUD("trustly", "chalanges");
        let users = await new CRUD("trustly", "users");
        let ret = await db.ReadMany({}, false, {
            likes: -1
        });
       for(let i = 0; i < ret.length; i++){
        creators.push(await users.Read({ _id: ret[i].creator }));
       }
        res.status(200).send({
            data: ret,
            creators: creators
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { getAllChalanges };