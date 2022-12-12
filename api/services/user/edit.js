const bcrypt = require("bcryptjs");
const CRUD = require("./../../db/db.js");
const { checkLoged } = require('./../../reuseble/checkUserLoged');
const { generateKey } = require('./../../reuseble/generateUserKey');
const cloudinary = require("./../../cloudinary");

async function Edit(req, res){
    let salt = await bcrypt.genSalt(4);
    let db = await new CRUD("trustly", "users");

    try {
        var { name, pass, mail, oldName, oldPass, oldLogo } = req.params;
        let [loged, status] = await checkLoged(oldName, oldPass);
        if(!!loged){
            let upload;
            if(req.file?.path){
                upload = await cloudinary.v2.uploader.upload(req.file.path);
            }
            if(oldLogo !== "unknown" && req.file?.path){
                cloudinary.uploader.destroy(oldLogo);
            }
            let oldMail = (await db.Read({ _id: loged._id })).mail;
            let mailChanged = false;
            if(oldMail !== mail){
                mailChanged = true;
            }
            if(pass === "unchanged"){
                if(upload){
                    await db.Update({_id: loged._id},{$set: {
                        name: name,
                        mail: mail,
                        logo: upload.secure_url,
                        activated: !mailChanged
                    }});
                }else{
                    await db.Update({_id: loged._id},{$set: {
                        name: name,
                        mail: mail,
                        activated: !mailChanged
                    }});
                }
            }else{
                let hashedPass = await bcrypt.hash(pass, salt);
                if(upload){
                    await db.Update({_id: loged._id},{$set: {
                        name: name,
                        mail: mail,
                        password: hashedPass,
                        logo: upload.secure_url,
                        activated: !mailChanged
                    }});
                }else{
                    await db.Update({_id: loged._id},{$set: {
                        name: name,
                        mail: mail,
                        password: hashedPass,
                        activated: !mailChanged
                    }});
                }
            }
            let key = await generateKey(name);
            if(upload){
                res.status(200).send({
                    error: false,
                    key: key,
                    logo: upload.secure_url,
                    logo_id: upload.public_id,
                    mailIsChanged: mailChanged,
                });
                return;
            }
            res.status(200).send({
                error: false,
                key: key,
                mailIsChanged: mailChanged,
            });
        }else{
            let err;
            if(status == 1){err=`Трябва да сте влезли в акаунт за да редактирате!`}
            else{err=`Сгрешена парола. Опитай пак!`}
            res.status(200).send({
                error: err
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: "Нещо се обърка!"
        });
    }
}

module.exports = { Edit };