const express = require('express');

const router = express.Router();

const passwordController = require('../controllers/forgotpassword');

router.post('/password/forgotpassword', passwordController.forgotpassword);

router.get('/password/resetpassword/:id', passwordController.resetpassword);

router.get('/password/updatepassword/:resetpasswordid', passwordController.updatepassword);

module.exports = router;