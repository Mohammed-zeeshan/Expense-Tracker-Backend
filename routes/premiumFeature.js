const express = require('express');

const router = express.Router();

const premiumFeatureController = require('../controllers/premiumFeature');
const userauthentication = require('../middleware/auth');

router.get('/premium/showleaderboard', userauthentication.authenticate, premiumFeatureController.showleaderboard);

module.exports = router;