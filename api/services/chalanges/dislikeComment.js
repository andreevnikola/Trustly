const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function dislikeComment(req, res){
    try {
        let { liker, comment } = req.params;
        let db = await new CRUD("trustly", "comments");
        let users = await new CRUD("trustly", "users");
        const user = (await users.Read({ key: liker }))._id;
        const commentID = new ObjectId(comment);
        const data = await db.Read({ _id: commentID });
        let isLiked = false;
        data.likers?.map((liker) => {
            if(user.equals(liker)){
                isLiked = true;
            }
        });
        if(!isLiked){
            res.send({
                error: "Не може да отхаресате коментар, който не сте харесали!"
            });
            return;
        }
        let ret = await db.Update({
            _id: commentID
        }, {
            $pull: {
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

module.exports = { dislikeComment };