const Sauce = require('../models/sauce');
const fs = require('fs');

// Create a sauce
exports.createSauce = async (request, response) => {
  try {
    const sauceObject = JSON.parse(request.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      userId: request.auth.userId,
      imageUrl: `/public/images/${request.file.filename}`,
    });
    const newSauce = await sauce.save();
    response.status(201).json(newSauce);
  } catch (error) {
    response.status(500).json({
      error
    });
  }
};


// Get all sauces
exports.readAllSauces = async (request, response) => {
  try {
    const sauces = await Sauce.find();
    const allSauces = sauces.map((sauce) => {
      sauce.imageUrl = `${request.protocol}://${request.get('host')}${sauce.imageUrl}`;
      return sauce._doc;
    });
    response.status(200).json(allSauces);
  } catch (error) {
    response.status(500).json({
      error
    });
  }
};

// Get one sauce
exports.readOneSauce = async (request, response) => {
  try {
    const sauce = await Sauce.findOne({
      _id: request.params.id
    });
    sauce.imageUrl = `${request.protocol}://${request.get('host')}${sauce.imageUrl}`;
    response.status(200).json(sauce);
  } catch {
    (error => response.status(500).json({
      error
    }));
  }
};

// Update sauce
exports.updateSauce = async (request, response) => {
  try {
    const sauceObject = request.file ? {
      ...JSON.parse(request.body.sauce),
      imageUrl: `/public/images/${request.file.filename}`
    } : {
      ...request.body
    };

    delete sauceObject._userId;

    const sauce = await Sauce.findOne({
      _id: request.params.id
    });

    if (sauce.userId != request.auth.userId) {
      response.status(401).json({
        message: 'Non autorisé'
      });
    } else {
      await Sauce.updateOne({
        _id: request.params.id
      }, {
        ...sauceObject,
        _id: request.params.id
      });
      response.status(200).json({
        message: 'objet modifié'
      });
    }
  } catch (error) {
    response.status(500).json({
      error
    });
  }
};


exports.likeSauce = async (request, response) => {
  try {
    const sauce = await Sauce.findOne({
      _id: request.params.id
    });
    switch (request.body.like) {
      case 1:
        let likeToSend = {
          $inc: {
            likes: 1
          },
          $push: {
            usersLiked: request.auth.userId
          }
        };
        if (sauce.usersDisliked.includes(request.auth.userId)) {
          likeToSend = {
            $inc: {
              likes: 1,
              dislikes: -1
            },
            $push: {
              usersLiked: request.auth.userId
            },
            $pull: {
              usersDisliked: request.auth.userId
            }
          };
        }
        if (!sauce.usersLiked.includes(request.auth.userId)) {
          const sauceUpdated = await Sauce.findByIdAndUpdate({
            _id: request.params.id
          }, likeToSend, {
            new: true
          });
          response.status(200).json(sauceUpdated);
        } else {
          response.status(200).json({
            message: "You've already liked this sauce"
          });
        }
        break;

      case 0:
        let likeToRemove = {
          $inc: {
            likes: -1
          },
          $pull: {
            usersLiked: request.auth.userId
          },
        };
        let dislikeToRemove = {
          $inc: {
            dislikes: -1
          },
          $pull: {
            usersDisliked: request.auth.userId
          },
        };
        if (sauce.usersLiked.includes(request.auth.userId)) {
          const sauceUpdated = await Sauce.findByIdAndUpdate({
            _id: request.params.id
          }, likeToRemove, {
            new: true
          });
          response.status(200).json(sauceUpdated);
          break;
        }
        if (sauce.usersDisliked.includes(request.auth.userId)) {
          const sauceUpdated = await Sauce.findByIdAndUpdate({
            _id: request.params.id
          }, dislikeToRemove, {
            new: true
          });
          response.status(200).json(sauceUpdated);
          break;
        }
        if (!sauce.usersLiked.includes(request.auth.userId) && !sauce.usersDisliked.includes(request.auth.userId)) {
          response.status(422).json({
            message: "You've tried to remove a like or a dislike but never added one before"
          });
        }
        break;

      case -1:
        let dislikeToSend = {
          $inc: {
            dislikes: 1
          },
          $push: {
            usersDisliked: request.auth.userId
          }
        };
        if (sauce.usersLiked.includes(request.auth.userId)) {
          dislikeToSend = {
            $inc: {
              likes: -1,
              dislikes: 1
            },
            $push: {
              usersDisliked: request.auth.userId
            },
            $pull: {
              usersLiked: request.auth.userId
            }
          };
        }
        if (!sauce.usersDisliked.includes(request.auth.userId)) {
          const sauceUpdated = await Sauce.findByIdAndUpdate({
            _id: request.params.id
          }, dislikeToSend, {
            new: true
          });
          response.status(200).json(sauceUpdated);
        } else {
          response.status(200).json({
            message: "You've already disliked this sauce"
          });
        }
        break;

      default:
        response.status(422).json({
          message: "Invalid value for like. Value must be -1, 0 or 1"
        });
        break;
    }
  } catch (error) {
    response.status(400).json({
      error
    });
  }
};

// Delete a sauce
exports.deleteSauce = async (request, response) => {
  try {
    const sauce = await Sauce.findOne({
      _id: request.params.id
    });

    if (sauce.userId != request.auth.userId) {
      response.status(401).json({
        message: 'Utilisateur non autorisé'
      });
    } else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, async () => {
        try {
          await Sauce.deleteOne({
            _id: request.params.id
          });
          response.status(200).json(sauce);
        } catch (error) {
          response.status(501).json({
            error
          });
        }
      });
    }
  } catch (error) {
    response.status(500).json({
      error
    });
  }
};