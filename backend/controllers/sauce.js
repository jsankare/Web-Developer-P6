const Sauce = require('../models/sauce');

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

// Delete a sauce

// Like or dislike a sauce