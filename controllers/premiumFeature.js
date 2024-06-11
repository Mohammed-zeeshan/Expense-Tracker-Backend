const SignUp = require('../models/signup');

exports.showleaderboard = async (req, res, next) => {
    try {
        const users = await SignUp.findAll({
            attributes: ['id', 'name', 'totalExpense'],
        });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}