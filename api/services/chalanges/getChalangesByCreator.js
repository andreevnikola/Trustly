const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function getChalangesByCreator(req, res){
    try {
        let { creator } = req.params;
        const creatorId = new ObjectId(creator)  
        let db = await new CRUD("trustly", "chalanges");
        let ret = await db.ReadMany({
            creator: creatorId
        }, null, {
            sorting_time: -1
        });
        res.status(200).send({
            chalanges: ret
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { getChalangesByCreator };