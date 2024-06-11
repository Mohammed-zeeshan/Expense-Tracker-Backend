const express = require('express');

const router = express.Router();

const signupController = require('../controllers/signup');

router.post('/user/addsignup', signupController.postsignup);

router.post('/user/login', signupController.postlogin);

module.exports = router;

