const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function unsubscribe(req, res){
    try {
        let { subscriber, subscribed } = req.params;
        let db = await new CRUD("trustly", "users");
        const user = await db.Read( {key: subscriber} );
        if(!user){ res.status(401).send(); return; }
        const subscribedId = new ObjectId(subscribed);
        const subscriberId = user._id;
        let isSubbed = user.following?.includes(subscribed);
        // user.following?.includes(subscribedId)
        if(!isSubbed){
            res.send({
                error: "Няма как да се отабонирате от профил за, кoйто не сте се абонирали!"
              });
              return;
        }
        let ret = await db.Update({
            key: subscriber
        }, {
            $pull: {
              following: subscribed
            }
        });
        if(!ret){
          throw 'Server error!';
        }
        ret = null;
        ret = await db.Update({
          _id: subscribedId
        }, {
            $pull: {
              subscribers: subscriberId
            }
        });
        if(!ret){
          throw "Acc that someone is unsubscribing from is not found!"
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { unsubscribe };