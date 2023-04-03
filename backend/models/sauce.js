// Import the Mongoose library
const mongoose = require('mongoose');

// Define the schema for a sauce document in the database
const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainPepper: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  heat: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  usersLiked: [{
    type: String,
    ref: 'User'
  }],
  usersDisliked: [{
    type: String,
    ref: 'User'
  }],
});

// Export the Sauce model, which uses the sauceSchema to define the schema for documents in the "sauces" collection
module.exports = mongoose.model('Sauce', sauceSchema);