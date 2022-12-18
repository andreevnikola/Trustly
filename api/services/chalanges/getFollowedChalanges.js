const CRUD = require("./../../db/db.js");

async function getFollowedChalanges(req, res){
    try {
        let { key } = req.params;
        let db = await new CRUD("trustly", "chalanges");
        let users = await new CRUD("trustly", "users");
        const user = await users.Read({ key: key });
        if(!user){ req.status(401).send(); return; }
        const isLiking = user.liking;
        const isDisLiking = user.disliking;
        if(!isLiking && !isDisLiking){
            req.send({
                error: "Акаунта ви не е последвал никой чалиндж!"
            });
        }
        let ret = await db.ReadMany({
            $or: [
                {_id: { $in: isLiking }},
                {_id: { $in: isDisLiking }}
            ]
        }, false, {
            last_updated: -1
        });
        let creatorIds = ret?.map((ret) => {
            return ret.creator;
        });
        let creators = await users.ReadMany({
            _id: { $in: creatorIds }
        });
        res.status(200).send({
            data: ret,
            creators: creators
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { getFollowedChalanges };