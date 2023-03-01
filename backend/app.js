const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// remplacer les valeurs en dur avec les valeurs dans le .env
mongoose.connect(`mongodb+srv://jsankare:vj8IDShvs2Rvo5TV@cluster0.vckfmxe.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware exemple
// app.use((req, res, next) => {
//     console.log('Requête reçue');
//     next();
// });

module.exports = app;