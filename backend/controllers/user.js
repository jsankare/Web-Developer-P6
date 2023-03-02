const bcrypt = require('bcrypt')

const user = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const nUser = new user({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({ message : 'utilisateur crée !'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {

};