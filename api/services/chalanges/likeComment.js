const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function likeComment(req, res){
    try {
        let { liker, comment } = req.params;
        let db = await new CRUD("trustly", "comments");
        let users = await new CRUD("trustly", "users");
        const user = (await users.Read({ key: liker }))._id;
        if(!user){ res.status(401).send(); return; }
        const commentID = new ObjectId(comment);
        const data = await db.Read({ _id: commentID });
        let isLiked = false;
        data.likers?.map((liker) => {
            if(user.equals(liker)){
                isLiked = true;
            }
        });
        if(isLiked){
            res.send({
                error: "Този коментар вече е харесан от вас!"
            });
            return;
        }
        let ret = await db.Update({
            _id: commentID
        }, {
            $push: {
                likers: user
            }
        });
        res.send({
            err: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { likeComment };