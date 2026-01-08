const mongoose = require('mongoose')

const designerSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    designSkills: String,
    additionalComments: String,
    profilePicture: String
  });
  
  // Create a Mongoose model based on the schema
  const Designer = mongoose.model('Designer', designerSchema);

  module.exports = Designer