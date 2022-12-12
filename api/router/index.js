const router = require('express').Router();
const { Register, Login, Edit, checkLoged, checkNameExistense, checkMail, activateMail } = require('./../services/user');
const { Upload, getChalangesByCreator, getChalangeById, like, dislike, getAllChalanges, comment, likeComment } = require('./../services/chalanges');
const { getProfileData, subscribe, unsubscribe } = require('./../services/profile');
const multer = require("multer");
const uploader = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 500000 }
  });

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + (Math.floor(Math.random() * 100000)).toString());
  },
});
const upload = multer({ storage });

router.get("/users/add/:name/:pass/:mail", (req, res) => { Register(req, res) });
router.get("/users/verify/:name/:mail", (req, res) => { checkMail(req, res) });
router.get("/users/activate/:mail/:key/:name", (req, res) => { activateMail(req, res) });
router.get("/users/login/:name/:pass", (req, res) => { Login(req, res) });
router.get("/users/auth/:key", (req, res) => { checkLoged(req, res) });
router.get("/users/exists/:name/:oldName", (req, res) => { checkNameExistense(req, res) });
router.post("/users/edit/:name/:pass/:mail/:oldName/:oldPass/:oldLogo", uploader.single("file"), (req, res) => { Edit(req, res) });
router.post("/chalange/upload/:name/:key", upload.array("pictures", 25), (req, res) => { Upload(req, res) });
router.get("/users/profile/:name/:key", (req, res) => { getProfileData(req, res) });
router.get("/chalanges/getbyprofile/:creator", (req, res) => { getChalangesByCreator(req, res) });
router.get("/chalanges/getbyid/:id/:key", (req, res) => { getChalangeById(req, res) });
router.get("/chalanges/all", (req, res) => { getAllChalanges(req, res) });
router.get("/chalanges/like/:liker/:liked/:chalange", (req, res) => { like(req, res) });
router.get("/chalanges/likecomment/:liker/:comment", (req, res) => { likeComment(req, res) });
router.get("/chalanges/comment/:commentatorKey/:message/:chalange", (req, res) => { comment(req, res) });
router.get("/chalanges/dislike/:liker/:liked/:chalange", (req, res) => { dislike(req, res) });
router.get("/profile/subscribe/:subscriber/:subscribed", (req, res) => { subscribe(req, res) });
router.get("/profile/unsubscribe/:subscriber/:subscribed", (req, res) => { unsubscribe(req, res) });


module.exports = router;