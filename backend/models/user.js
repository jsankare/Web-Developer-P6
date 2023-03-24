// Import the Mongoose library
const mongoose = require('mongoose');
// Import the Mongoose unique validator plugin
const uniqueValidator = require('mongoose-unique-validator');

// Define a user schema for the MongoDB database
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Add the uniqueValidator plugin to the user schema
userSchema.plugin(uniqueValidator);

// Export a Mongoose model for the user schema
module.exports = mongoose.model('User', userSchema);
