const CRUD = require("./../../db/db.js");

async function getProfileData(req, res){
    try {
        let { name, key } = req.params;
        let db = await new CRUD("trustly", "users");
        let isSubscribed = false;
        let ret = await db.Read({
            name: name
        });
        if(key != "null"){
            var user = await db.Read({
                key: key
            });
            var usr = user._id
            ret.subscribers?.map((sub) => {
                if(sub.equals(usr)){
                    isSubscribed = true;
                    return;
                }
            }) || null;
        }
        let chalanges = [];
        if(ret.chalanges){
            ret.chalanges.map((chalange) => {
                chalanges.push(chalange.toString())
            });
            res.status(200).send({
                name: ret.name,
                mail: ret.mail,
                logo: ret.logo,
                chalanges_nmb: chalanges.length,
                chalanges: chalanges,
                subs: ret.subscribers ? ret.subscribers.length : "0",
                likes: ret.likes ? ret.likes : "0",
                reports: ret.reports ? ret.reports : "0",
                id: ret._id.toString(),
                subscribed: isSubscribed,
            });
            return;
        }
        res.status(200).send({
            name: ret.name,
            mail: ret.mail,
            logo: ret.logo,
            chalanges_nmb: 0,
            subs: ret.subs ? ret.subs : "0",
            likes: ret.likes ? ret.likes : "0",
            reports: ret.reports ? ret.reports : "0",
            id: ret._id.toString(),
            subscribed: isSubscribed,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}

module.exports = { getProfileData };