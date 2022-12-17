const Upload = require('./upload').Upload;
const EditChalange = require('./Edit').Edit;
const getChalangesByCreator = require("./getChalangesByCreator").getChalangesByCreator;
const getChalangeById = require('./getChalangeById').getChalangeById;
const like = require('./like').like;
const dislike = require('./dislike').dislike;
const getAllChalanges = require('./getAllChalanges').getAllChalanges;
const comment = require('./comment').comment;
const likeComment = require('./likeComment').likeComment;
const dislikeComment = require('./dislikeComment').dislikeComment;
const deleteChalange = require('./deleteChalange').deleteChalange;
const deleteComment = require('./deleteComment').deleteComment;
const getFollowedChalanges = require('./getFollowedChalanges').getFollowedChalanges;
const searchChalanges = require('./searchChalanges').searchChalanges;
const dontLikeChalange = require('./dontLikeChalange').dontLikeChalange;
const undoDontLikeChalange = require('./undoDontLikeChalange').undoDontLikeChalange;

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
    EditChalange,
    getFollowedChalanges,
    searchChalanges,
    dontLikeChalange,
    undoDontLikeChalange
};