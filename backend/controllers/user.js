const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
            response.status(201).json({ message: 'utilisateur crée !' });
        } catch (error) {
            response.status(400).json({ error });
        }
    } catch (error) {
        response.status(500).json({ error });
    }
};

exports.login = async (request, response, next) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (user === null) {
            response.status(401).json({ message: 'Paire login/password incorrecte' });
        }
        else {
            try {
                const valid = await bcrypt.compare(request.body.password, user.password);
                if (!valid) {
                    response.status(401).json({ message: 'Paire login/password incorrecte' });
                }
                else {
                    response.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                }
            }
            catch (error) {
                console.error('Issue with brcypt', error);
                response.status(500).json({ error });
            }
        }
    }
    catch (error) {
        console.error('Issue with MangoDB', error);
        response.status(500).json({ error });
    }
};