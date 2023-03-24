// Import required packages and set environment variables
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Import route handlers
const Sauce = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Set global Mongoose option to allow flexible queries
mongoose.set('strictQuery', false);

// Connect to MongoDB Atlas using environment variables for authentication
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vckfmxe.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('Connexion à MongoDB réussie '))
  .catch(() => console.log('Connexion à MongoDB échouée '));

// Create Express.js app
const app = express();

// Enable CORS and JSON body parsing middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/public', express.static('public'));

// Use route handlers for authentication and sauces
app.use('/api/auth', userRoutes);
app.use('/api/sauces', Sauce);

// Export app for use in server.js
module.exports = app;
