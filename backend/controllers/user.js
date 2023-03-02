const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    User.findOne({email: request.body.email})
    .then(user => {
        if (user === null) {
            response.status(401).json({message : 'Paire login/password incorrecte'})
        }
        else {
            bcrypt.compare(request.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    response.status(401).json({message : 'Paire login/password incorrecte'})
                }
                else {
                    response.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_SECRET_TOKEN',
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => {
                response.status(500).json({error});
            })
        }
    })
    .catch(error => {
        response.status(500).json( {error} );
    })
};