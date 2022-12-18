const CRUD = require("./../../db/db.js");
const dotenv = require("dotenv");
const cloudinary = require("./../../cloudinary");
dotenv.config();

async function Upload(req, res) {
  try {
    let db = await new CRUD("trustly", "chalanges");
    let users = await new CRUD("trustly", "users");

    let { name, key } = req.params;
    let { title, description, thumnail, status, steps } = req.body;
    if(steps){steps = JSON.parse(steps)}
    let result = await users.Read({
      name: name,
      key: key,
      activated: true
    });
    if (!result) {
      res.status(401).send({
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

    const raw_date = new Date();
    const for_upload_date = raw_date.toLocaleDateString();
    const time = raw_date.toTimeString().slice(0, 5);
    const sort_time = raw_date.getTime();
    if(steps){
        let readyForUploadSteps = [];
        steps.map((step) => {
            if(uploadedImages.length > 0){
              let imagesForUplaod = [];
              for(let i = 0; i < uploadedImages.length; i++){
                  if( step.images.includes(uploadedImages[i][2]) ){
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
              });
            }
        })
        result = await db.Create({
            creator: result._id,
            title: title,
            description: description,
            thumnail: thumnail,
            status: status,
            steps: readyForUploadSteps,
            time: time,
            date: for_upload_date,
            sorting_time: sort_time,
            last_updated: sort_time
        });
    }else{
        result = await db.Create({
            creator: result._id,
            title: title,
            description: description,
            thumnail: thumnail,
            status: status,
            time: time,
            date: for_upload_date,
            sorting_time: sort_time,
            last_updated: sort_time
        });
    }
    await users.Update({
      key: key,
    }, {
      $push: {
        chalanges: result.insertedId
      }
    });
    console.log(
      "New chalange is uploaded with _id: " + result.insertedId + " and the sender is: " + name
    );
    res.status(200).send({
      error: false
    });
  } catch (error) {
    console.error("Error uploading chalange: " + error.toString());
    res.status(500).send();
  }
}

module.exports = { Upload };
