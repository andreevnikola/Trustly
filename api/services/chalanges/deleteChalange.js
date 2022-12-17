const CRUD = require("./../../db/db.js");
const ObjectId = require('mongodb').ObjectId;
const dotenv = require("dotenv");
const cloudinary = require("./../../cloudinary");
dotenv.config();

async function deleteChalange(req, res){
    try {
        let { key, chalange } = req.params;
        let db = await new CRUD("trustly", "chalanges");
        let users = await new CRUD("trustly", "users");
        const creator = (await users.Read({ key: key }))._id;
        chalange = new ObjectId(chalange);
        let data = await db.Read({ _id: chalange });
        if(!creator || data.creator.toString() !== creator.toString()){
            res.send({
                error: 'Не може да изтриете предизвикателство, което не е качено от вас!'
            });
            return;
        }
        for(let i = 0; i < data.steps.length; i++){
            for(let k = 0; k < data.steps[i].images?.length; k++){
                cloudinary.uploader.destroy(data.steps[i].images[k]);
            }
        }
        await db.Delete({ _id: chalange });
        await users.Update({
            _id: creator
        }, {
            $pull: {
                chalanges: chalange
            },
            $inc: {
                likes: -(data.likes)
            }
        });
        res.send({
            error: false,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { deleteChalange };