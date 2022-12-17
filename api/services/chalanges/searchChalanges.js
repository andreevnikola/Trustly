const CRUD = require("./../../db/db.js");

async function searchChalanges(req, res){
    try {
        let { input } = req.params;
        let db = await new CRUD("trustly", "chalanges");
        let users = await new CRUD("trustly", "users");
        let regex = [];
        const predlozi = ["за", "под", "до", "в", "на", "над", "върху", "между", "горе", "долу", "със"]
        input.split(" ").map((inp) => {
            if(predlozi.includes(inp)){ return; }
            regex.push( new RegExp(inp, "i") );
        });
        let ret = await db.ReadMany({
            $or: [
                { title: { $in: regex } },
                { description: { $in: regex } }
            ]
        });
        ret.sort((a, b) => {
            let aScore = 0;
            let bScore = 0;
            let countTitleA = 0;
            let countTitleB = 0;
            let countDescriptionA = 0;
            let countDescriptionB = 0;
            input.split(" ").map((inp) => {
                countTitleA += (a.title.match(new RegExp(inp, "gi")) || []).length * 16;
                countTitleB += (b.title.match(new RegExp(inp, "gi")) || []).length * 16;
                countDescriptionA += (a.description.match(new RegExp(inp, "gi")) || []).length * 8;
                countDescriptionB += (b.description.match(new RegExp(inp, "gi")) || []).length * 8;
            })
            const repeatPointsA = countDescriptionA + countTitleA;
            const repeatPointsB = countDescriptionB + countTitleB;
            aScore += repeatPointsA;
            bScore += repeatPointsB;
            aScore += (a.likes - b.likes)*2;
            bScore += (b.likes - a.likes)*2;
            if(a.last_updated){
                if(b.last_updated){
                    aScore += (a.last_updated - b.last_updated)/3600000;
                }else{
                    aScore += (a.last_updated - b.sorting_time)/3600000;
                }
            }else{
                if(b.last_updated){
                    aScore += (a.sorting_time - b.last_updated)/3600000;
                }else{
                    aScore += (a.sorting_time - b.sorting_time)/3600000;
                }
            }
            if(b.last_updated){
                if(a.last_updated){
                    bScore += (b.last_updated - a.last_updated)/3600000;
                }else{
                    bScore += (b.last_updated - a.sorting_time)/3600000;
                }
            }else{
                if(a.last_updated){
                    bScore += (b.sorting_time - a.last_updated)/3600000;
                }else{
                    bScore += (b.sorting_time - a.sorting_time)/3600000;
                }
            }
            if(a.status === "започнат"){
                aScore += 10
            }
            if(b.status === "започнат"){
                bScore += 10
            }

            if(a.status === "завършен"){
                aScore -= 5
            }
            if(b.status === "завършен"){
                bScore -= 5
            }
            return aScore > bScore ? -1 : 1;
        });
        let creatorIds = ret?.map((ret) => {
            return ret.creator;
        });
        let creators = await users.ReadMany({
            _id: { $in: creatorIds }
        });
        let actualCreators = creatorIds;
        ret?.map((ret, i) => {
            creators?.map((creator) => {
                if(creator._id.equals(ret.creator)){
                    actualCreators[i] = creator;
                }
            });
        });
        let retUser = await users.ReadMany({
            name: { $in: regex },
        });
        if(retUser){
            retUser?.sort((a, b) => {
                let aScore = 0;
                let bScore = 0;
                aScore += a.likes - b.likes;
                bScore -= a.likes - b.likes;
                aScore += (a.subscribers - b.subscribers)*2;
                bScore -= (a.subscribers - b.subscribers)*2;
                return aScore > bScore ? -1 : 1;
            });
            res.status(200).send({
                data: ret,
                creators: actualCreators,
                profiles: retUser
            });
            return;
        }
        res.status(200).send({
            data: ret,
            creators: actualCreators
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

module.exports = { searchChalanges };