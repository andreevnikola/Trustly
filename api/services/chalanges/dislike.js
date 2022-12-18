const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function dislike(req, res){
    try {
        let { liker, liked, chalange } = req.params;
        let db = await new CRUD("trustly", "users");
        let chalanges = await new CRUD("trustly", "chalanges");
        const user = await db.Read( {key: liker} );
        if(!user){ res.status(401).send(); return; }
        const likedId = new ObjectId(liked);
        const chalangeId = new ObjectId(chalange);
        const likerId = user._id;
        let isLiked = false;
        user.liking?.map((like) => {
            if(like && like.equals(chalangeId)){
                isLiked = true
            }
        });
        if(!isLiked){
          res.send({
            error: "Няма как да отхаресате, чалиндж, който не сте харесали!"
          });
          return;
        }
        let ret = await chalanges.Update({
            _id: chalangeId
        }, {
            $inc: {
              likes: -1
            }
        });
        if(!ret){
          res.sned({
            error: "Чалинджа не е намерен!"
          });
          return;
        }
        ret = await db.Update({
            _id: likerId
        }, {
            $pull: {
              liking: chalangeId
            }
        });
        if(!ret){
          throw 'Server ERROR!';
        }
        ret = null;
        ret = await db.Update({
          _id: likedId
        }, {
            $inc: {
              likes: -1
            }
        });
        if(!ret){
          throw "Acc which chalange someone is disliking to is not found!"
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { dislike };