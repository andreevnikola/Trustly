let Upload = require('./upload').Upload;
let EditChalange = require('./Edit').Edit;
let getChalangesByCreator = require("./getChalangesByCreator").getChalangesByCreator;
let getChalangeById = require('./getChalangeById').getChalangeById;
let like = require('./like').like;
let dislike = require('./dislike').dislike;
let getAllChalanges = require('./getAllChalanges').getAllChalanges;
let comment = require('./comment').comment;
let likeComment = require('./likeComment').likeComment;
let dislikeComment = require('./dislikeComment').dislikeComment;
let deleteChalange = require('./deleteChalange').deleteChalange;
let deleteComment = require('./deleteComment').deleteComment;

module.exports = {
    Upload,
    getChalangesByCreator,
    getChalangeById,
    like,
    dislike,
    getAllChalanges,
    comment,
    likeComment,
    dislikeComment,
    deleteChalange,
    deleteComment,
    EditChalange
};