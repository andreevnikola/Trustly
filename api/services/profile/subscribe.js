const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;

async function subscribe(req, res){
    try {
        let { subscriber, subscribed } = req.params;
        let db = await new CRUD("trustly", "users");
        const user = await db.Read( {key: subscriber} );
        const subscribedId = new ObjectId(subscribed);
        const subscriberId = user._id;
        const isSubbed = user.following?.includes(subscribed);
        if(isSubbed){
          res.send({
            error: "Вече сте абонирани за този потребител!"
          });
        }
        let ret = await db.Update({
            key: subscriber
        }, {
            $push: {
              following: subscribed
            }
        });
        if(!ret){
          res.sned({
            error: "Акаунта ви не е намерен!"
          });
          return;
        }
        ret = null;
        ret = await db.Update({
          _id: subscribedId
        }, {
            $push: {
              subscribers: subscriberId
            }
        });
        if(!ret){
          throw "Acc that someone is subscribing to is not found!"
        }
        res.status(200).send({
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { subscribe };