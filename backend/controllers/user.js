const bcrypt = require('bcrypt')

const User = require('../models/user');

exports.signup = async (request, response, next) => {
    try {
        const { password, email } = request.body;

        const hash = await bcrypt.hash(password, 10)
        const user = new User({
            email: email,
            password: hash
        });

        try {
            await user.save();
            response.status(201).json({ message : 'utilisateur crée !'});
        } catch (error) {
            response.status(400).json({error});
        }
    } catch (error) {
        response.status(500).json({error});
    }
};

exports.login = (request, response, next) => {

};