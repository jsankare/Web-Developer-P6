const Sauce = require('../models/sauce');
const fs = require('fs');
const { error } = require('console');

// Create a sauce
exports.createSauce = (request, response) => {
  const sauceObject = JSON.parse(request.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    userId: request.auth.userId,
    imageUrl: `/public/images/${request.file.filename}`,
  });
  sauce.save()
    .then((sauce) => response.status(201).json(sauce))
    .catch((error) => response.status(500).json({ error }));
};

// Get all sauces
exports.readAllSauces = (request, response) => {
  Sauce.find()
    .then((sauces) => {
      const allSauces = sauces.map((sauce) => {
        sauce.imageUrl = `${request.protocol}://${request.get('host')}${sauce.imageUrl}`;
        return sauce._doc;
      });
      response.status(200).json(allSauces);
    })
    .catch((error) => response.status(500).json({ error }));
};

// Get one sauce
exports.readOneSauce = (request, response) => {
  Sauce.findOne({_id: request.params.id})
    .then(sauce => {
      sauce.imageUrl = `${request.protocol}://${request.get('host')}${sauce.imageUrl}`;
      response.status(200).json(sauce);
    })
    .catch(error => response.status(500).json({error}));
};

// Update a sauce
exports.updateSauce = (request, response) => {
  Sauce.findOne({_id: request.params.id})
  .then(sauce => {
    if (sauce.userId != request.auth.userId) {
      response.status(401).json({message : 'Utilisateur non autorisé'});
    }
    else {
      console.log('toto')
    }
  })
  console.log(error)
  .catch(error => response.status(418).json({error}))
}

// Like or dislike a sauce

// Delete a sauce
exports.deleteSauce = (request, response) => {
  Sauce.findOne({_id: request.params.id})
  .then(sauce => {
    if (sauce.userId != request.auth.userId) {
      response.status(401).json({message : 'Utilisateur non autorisé'});
    }
    else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: request.params.id})
        .then((sauce) => response.status(200).json(sauce))
        .catch(error => response.status(501).json({error}));
      });
    }
  })
  .catch(error => {
    console.log(error)
    response.status(500).json({error})
  })
}