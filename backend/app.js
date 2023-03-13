const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const Sauce = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.set('strictQuery', false);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vckfmxe.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('Connexion à MongoDB réussie '))
  .catch(() => console.log('Connexion à MongoDB échouée '));

const app = express();

app.use(cors());
app.use(express.json());

app.use('/public', express.static('public'));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', Sauce);

module.exports = app;
