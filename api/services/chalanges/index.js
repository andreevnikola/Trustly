let Upload = require('./upload').Upload;
let getChalangesByCreator = require("./getChalangesByCreator").getChalangesByCreator;
let getChalangeById = require('./getChalangeById').getChalangeById;
let like = require('./like').like;
let dislike = require('./dislike').dislike;
let getAllChalanges = require('./getAllChalanges').getAllChalanges;
let comment = require('./comment').comment;
let likeComment = require('./likeComment').likeComment;

module.exports = {
    Upload,
    getChalangesByCreator,
    getChalangeById,
    like,
    dislike,
    getAllChalanges,
    comment,
    likeComment
};