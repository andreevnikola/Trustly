const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function undoDontLikeChalange(req, res){
    try {
        let { disliker, disliked, chalange } = req.params;
        let db = await new CRUD("trustly", "users");
        let chalanges = await new CRUD("trustly", "chalanges");
        const user = await db.Read( {key: disliker} );
        const chalangeId = new ObjectId(chalange);
        const dislikerId = user._id;
        let isDisLiked = false;
        user.disliking?.map((dislike) => {
            if(dislike && dislike.equals(chalangeId)){
                isDisLiked = true
            }
        });
        if(!isDisLiked){
          res.send({
            error: "Няма как да отзаложите, че чалиндж ще бъде провален, ако не сте заложили, че ще се провали!"
          });
          return;
        }
        let ret = await chalanges.Update({
            _id: chalangeId
        }, {
            $inc: {
              dislikes: -1
            }
        });
        if(!ret){
          res.sned({
            error: "Чалинджа не е намерен!"
          });
          return;
        }
        ret = await db.Update({
            _id: dislikerId
        }, {
            $pull: {
              disliking: chalangeId
            }
        });
        if(!ret){
          throw 'Server ERROR!';
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { undoDontLikeChalange };