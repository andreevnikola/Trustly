const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function getChalangeById(req, res){
    try {
        let { id, key } = req.params;
        const idFormatted = new ObjectId(id)  
        let db = await new CRUD("trustly", "chalanges");
        let users = await new CRUD("trustly", "users");
        let commentsDB = await new CRUD("trustly", "comments");
        let ret = await db.Read({
            _id: idFormatted
        });
        let userId = new ObjectId(ret.creator);
        let user = await users.Read({
            _id: userId
        })
        if(key != "null"){
            var myUser = await users.Read({ key: key });
            if(!ret){
                res.send({
                    error: true
                });
            }
            var isLiked = false;
            myUser.liking?.map((like) => {
                if(like?.equals(ret._id)){
                    isLiked = true;
                }
            });
        }
        let chalanges = [];
        user.chalanges.map((chalange) => {
            chalanges.push(chalange.toString())
        });

        let comments = false;
        comments = await commentsDB.ReadMany({
            chalange: idFormatted
        }, null, {
            sortTime: -1
        });
        for(let i = 0; i < comments.length; i++){
            let user = await users.Read({ _id: comments[i].commentator });
            let name = user.name;
            let logo = user.logo || false;
            comments[i].commentator = name;
            comments[i].logo = logo;
            for(let k = 0; k < comments[i].likers?.length; k++){
                comments[i].likers[k] = (await users.Read({ _id: comments[i].likers[k] })).name;
            }
        }

        res.status(200).send({
            chalange: ret,
            comments: comments,
            isLiked: isLiked,
            creator: {
                name: user.name,
                mail: user.mail,
                logo: user.logo,
                chalanges: chalanges,
                subs: user.subscribers ? user.subscribers.length : "0",
                likes: user.likes ? user.likes : "0",
                reports: user.reports ? user.reports : "0",
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { getChalangeById };