const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function dontLikeChalange(req, res){
    try {
        let { disliker, disliked, chalange } = req.params;
        let db = await new CRUD("trustly", "users");
        let chalanges = await new CRUD("trustly", "chalanges");
        const user = await db.Read( {key: disliker} );
        const dislikedId = new ObjectId(disliked);
        const chalangeId = new ObjectId(chalange);
        const likerId = user._id;
        let isDisLiked = false;
        user.disliking?.map((dislike) => {
            if(dislike && dislike.equals(dislikedId)){
                isDisLiked =  true
            }
        });
        if(isDisLiked){
          res.send({
            error: "Вече сте дали FAIL за този чалиндж!"
          });
          return;
        }
        let ret = await chalanges.Update({
            _id: chalangeId
        }, {
            $inc: {
              dislikes: 1
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
            $push: {
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

module.exports = { dontLikeChalange };