const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchase');
const userauthentication = require('../middleware/auth');

router.get('/purchase/premiummembership', userauthentication.authenticate, purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', userauthentication.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;