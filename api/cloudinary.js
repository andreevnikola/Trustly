
const cloudinary = require('cloudinary');
require('dotenv').config();
const { cloudinary_clod_name } = require('./variables');

cloudinary.config({
  cloud_name: cloudinary_clod_name,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;