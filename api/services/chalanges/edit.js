const CRUD = require("./../../db/db.js");
const dotenv = require("dotenv");
const cloudinary = require("./../../cloudinary");
const ObjectId = require('mongodb').ObjectId;
dotenv.config();

async function Edit(req, res) {
  try {
    let db = await new CRUD("trustly", "chalanges");
    let users = await new CRUD("trustly", "users");

    let { name, key } = req.params;
    let { title, description, thumnail, status, steps, imagesForDelete, id } = req.body;
    if(imagesForDelete === "null"){ imagesForDelete = false; }
    else{ imagesForDelete = JSON.parse(imagesForDelete); }
    if(steps){steps = JSON.parse(steps)}
    id = new ObjectId(id);
    let result = await users.Read({
      name: name,
      key: key,
      activated: true,
      chalanges: id
    });
    if (!result) {
      res.status(200).send({
        error: "Нямате права за извършването на това действие!",
      });
      return;
    }

    let pictureFiles = req.files;
    let uploadedImages = [];
    if (pictureFiles){
        let multiplePicturePromise = pictureFiles.map(async (picture, index) => {
            if(picture.mimetype === "video/MP2T" || picture.mimetype === "video/3gpp" || picture.mimetype === "video/x-mpegURL" || picture.mimetype === "video/x-flv" || picture.mimetype === "video/mp4" || picture.mimetype === "video/quicktime" || picture.mimetype === "video/x-msvideo" || picture.mimetype === "video/x-ms-wmv"){
                let data = await cloudinary.v2.uploader.upload(picture.path, { 
                    resource_type: "video", 
                    quality: "auto:eco"
                });
                uploadedImages.push([data.secure_url, 'video', picture.originalname]);
                return;
            }
        let data = await cloudinary.v2.uploader.upload(picture.path, { fetch_format: "auto", quality: "auto:eco" });
        if( thumnail && thumnail === picture.originalname ){
          thumnail = data.secure_url;
          return
        }
        uploadedImages.push([data.secure_url, 'image', picture.originalname]);
        });
        await Promise.all(multiplePicturePromise);
    }
    if(imagesForDelete){
        for(let i = 0; i < imagesForDelete.length; i++){
            if(imagesForDelete[i] === thumnail){ thumnail = undefined }
            else{
                steps?.map((step, steps_i) => {
                    if(step.images?.includes(imagesForDelete[i])){
                        steps[steps_i].images.splice(step.images.indexOf(imagesForDelete[i]));
                    }
                });
            }
            try{
                await cloudinary.uploader.destroy(imagesForDelete[i][0].split('/')[7].split('.')[0]);
            }catch{
                await cloudinary.uploader.destroy(imagesForDelete[i].split('/')[7].split('.')[0]);
            }
        }
    }

    if(steps){
        let og = await db.Read({ _id: id });
        let readyForUploadSteps = [];
        steps.map((step, i) => {
            let og_images = og.steps[i]?.images || [];
            if(imagesForDelete && og_images !== []){
                imagesForDelete.map((del) => {
                    og_images = og_images.filter((img) => {
                        return img[0] !== del[0]
                    });
                });
            }
            if(uploadedImages.length > 0){
              let imagesForUplaod = og_images;
              for(let i = 0; i < uploadedImages.length; i++){
                  if( step.images?.includes(uploadedImages[i][2]) ){
                    imagesForUplaod.push([uploadedImages[i][0], uploadedImages[i][1]]);
                  }
              }
              readyForUploadSteps.push({
                  title: step.title,
                  description: step.description,
                  start: step.start,
                  end: step.end,
                  images: imagesForUplaod
              });
            }else{
              readyForUploadSteps.push({
                  title: step.title,
                  description: step.description,
                  start: step.start,
                  end: step.end,
                  images: og_images
              });
            }
        })
        result = await db.Update({
            _id: id
        },{
            $set: {
                creator: result._id,
                title: title,
                description: description,
                thumnail: thumnail,
                status: status,
                steps: readyForUploadSteps,
            }
        });
    }else{
        result = await db.Update({
            _id: id
        }, {
            $set: {
                creator: result._id,
                title: title,
                description: description,
                thumnail: thumnail,
                status: status,
            }
        });
    }
    res.status(200).send({
      error: false
    });
  } catch (error) {
    console.error("Error uploading chalange: " + error.toString());
    res.status(500).send();
  }
}

module.exports = { Edit };
