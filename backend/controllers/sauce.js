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

  const sauceObject = request.file ? {
    ...JSON.parse(request.body.sauce),
    imageUrl: `/public/images/${request.file.filename}`
  } : {...request.body};

  delete sauceObject._userId;
  Sauce.findOne({_id: request.params.id})
    .then((sauce) => {
      if (sauce.userId != request.auth.userId) {
        response.status(401).json({message :'Non autorisé'});
      }
      else {
        Sauce.updateOne({_id: request.params.id}, {...sauceObject, _id: request.params.id})
        .then(() => response.status(200).json({message: 'objet modifié'}))
        .catch(error => response.status(401).json({error}));
      }
    })
}

// Like or dislike a sauce
exports.likeSauce = (request, response) => {
  // Find the sauce in the database based on its ID
  Sauce.findOne({_id: request.params.id})
  .then(sauce => {
    switch(request.body.like) {

      // If the user is liking the sauce
      case 1:
        let likeToSend = {
          $inc:{likes: 1},
          $push:{usersLiked: request.auth.userId}
        };
        // If the user had previously disliked the sauce, adjust the changes accordingly
        if(sauce.usersDisliked.includes(request.auth.userId)){
          likeToSend = {
            // Increment the number of likes and decrement the number of dislikes
            $inc:{likes:1, dislikes:-1},
            // Add the user's ID to the list of users who liked the sauce
            $push:{usersLiked: request.auth.userId},
            // Remove the user's ID from the list of users who disliked the sauce
            $pull:{usersDisliked: request.auth.userId}
          };
        }
        // If the user had not previously liked the sauce, update the database with the changes
        if(!sauce.usersLiked.includes(request.auth.userId)) {
          Sauce.findByIdAndUpdate({_id: request.params.id}, likeToSend, {new: true})
            .then(sauceUpdated => {
              response.status(200).json(sauceUpdated);
            })
            .catch(error => response.status(400).json({error}));
        } 
        else {
          // If the user had already liked the sauce, return an error message
          response.status(200).json({message: "You've already liked this sauce"});
        }
        break;

        // If the user is removing their like or dislike
        case 0:
        let likeToRemove = {
          // Decrement the number of likes
          $inc:{likes: -1},
          // Remove the user's ID from the list of users who liked the sauce
          $pull:{usersLiked: request.auth.userId},
        };
        let dislikeToRemove = {
          // Decrement the number of likes
          $inc:{dislikes: -1},
          // Remove the user's ID from the list of users who disliked the sauce
          $pull:{usersDisliked: request.auth.userId},
        };
        // If the user had previously liked the sauce, update the database with the changes
        if(sauce.usersLiked.includes(request.auth.userId)) {
          Sauce.findByIdAndUpdate({_id: request.params.id}, likeToRemove, {new: true})
            .then(sauceUpdated => {
              response.status(200).json(sauceUpdated);
            })
            .catch(error => response.status(400).json({error}));
            break;
        } 
        // If the user had previously disliked the sauce, update the database with the changes
        if(sauce.usersDisliked.includes(request.auth.userId)) {
          Sauce.findByIdAndUpdate({_id: request.params.id}, dislikeToRemove, {new: true})
            .then(sauceUpdated => {
              response.status(200).json(sauceUpdated);
            })
            .catch(error => response.status(400).json({error}));
            break;
        }
        // If the user had not previously liked or disliked the sauce, return an error message
        if( (!sauce.usersLiked.includes(request.auth.userId)) && (!sauce.usersDisliked.includes(request.auth.userId)) ){
          response.status(422).json({message: "You've tried to remove a like or a dislike but never added one before"});
        }
        break;

        // If the user is disliking the sauce
        case -1:
        // Create an object to update the sauce document in the database
        let dislikeToSend = {
          $inc:{dislikes: 1},
          $push:{usersDisliked: request.auth.userId}
        };
        // If user has already liked the sauce, then update object should decrement likes and increment dislikes
        if(sauce.usersLiked.includes(request.auth.userId)){
          dislikeToSend = {
            $inc:{likes: -1, dislikes: 1},
            $push:{usersDisliked: request.auth.userId},
            $pull:{usersLiked: request.auth.userId}
          };
        }
        // If user has not already disliked the sauce, update the sauce with the dislikeToSend object
        if(!sauce.usersDisliked.includes(request.auth.userId)) {
          Sauce.findByIdAndUpdate({_id: request.params.id}, dislikeToSend, {new: true})
            .then(sauceUpdated => {
              response.status(200).json(sauceUpdated);
            })
            .catch(error => response.status(400).json({error}));
        } 
        // If user has already disliked the sauce, return an error message
        else {
          response.status(200).json({message: "You've already disliked this sauce"});
        }
        break;
        default:
        response.status(422).json({message: "Invalid value for like. Value must be -1, 0 or 1"});
    }
  })
  .catch(error => response.status(400).json({error}));
};

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