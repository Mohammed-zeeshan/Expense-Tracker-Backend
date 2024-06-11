const jwt = require('jsonwebtoken');

const SignUp = require('../models/signup');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        SignUp.findByPk(user.userId).then(user => {
            console.log(user);
            req.user = user;
            next();
        }).catch(err => {console.log(err)})
    } catch (err) {
        console.log(err);
    }
}