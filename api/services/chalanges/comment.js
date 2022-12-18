const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function comment(req, res){
    try {
        let { commentatorKey, message, chalange } = req.params;
        let db = await new CRUD("trustly", "comments");
        let users = await new CRUD("trustly", "users");
        const commentator = (await users.Read({ key: commentatorKey }))._id;
        if(!commentator){
            res.status(401).send({
                error: 'Акаунта Ви не е намерен!'
            });
            return;
        }
        chalange = new ObjectId(chalange);
        const raw_date = new Date();
        const for_upload_date = raw_date.toLocaleDateString();
        const time = raw_date.toTimeString().slice(0, 5);
        const sort_time = raw_date.getTime();
        let ret = await db.Create({
            commentator: commentator,
            chalange: chalange,
            message: message,
            date: for_upload_date,
            time: time,
            sortTime: sort_time,
        });
        res.send({
            error: false,
            id: ret.insertedId
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { comment };