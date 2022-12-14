const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;
const dotenv = require("dotenv");
const cloudinary = require("./../../cloudinary");
dotenv.config();

async function deleteComment(req, res){
    try {
        let { key, comment } = req.params;
        let comments = await new CRUD("trustly", "comments");
        let users = await new CRUD("trustly", "users");
        const commentator = (await users.Read({ key: key }))._id;
        comment = new ObjectId(comment);
        const actualCommentator = (await comments.Read({ _id: comment })).commentator;
        if(!commentator || commentator.toString() !== actualCommentator.toString()){
            res.send({
                error: 'Не може да изтриете коментар, който не е качено от вас!'
            });
            return;
        }
        await comments.Delete({ _id: comment });
        res.send({
            error: false,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { deleteComment };