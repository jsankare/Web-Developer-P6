const Sauce = require('../models/sauce'); 

// Get all sauces
exports.readAllSauces = (request, response, next) => {
    Sauce.find()
      .then(allSauces => {
        allSauces = allSauces.map(sauce => {
          sauce.imageUrl = `${request.protocol}://${request.get('host')}${sauce.imageUrl}`
          const links = sauceLinks(sauce._id)
          return {...sauce._doc, links}
        })
        response.status(200).json(allSauces);
      })
      .catch(error => response.status(500).json({error}));
  };

// Create a sauce
exports.createSauce = (request, response, next) => {
    const sauceObject = JSON.parse(request.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        userId: request.auth.userId,
        imageUrl: `/public/images/${request.file.filename}`
    });
    sauce.save()
    .then((sauce) => response.status(201).json(sauce))
    .catch(error => response.status(500).json({error}));
};

// model links
function sauceLinks(sauceId) {
    return [
        {
            rel: "createSauce",
            method: "POST",
            href: "http://localhost:3000/api/sauces"
        },
        {
            rel: "getAllSauces",
            method: "GET",
            href: "http://localhost:3000/api/sauces",
          }
    ]
}