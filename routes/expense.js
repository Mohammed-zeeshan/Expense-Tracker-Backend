const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth');

router.post('/expense/addExpense', userauthentication.authenticate, expenseController.postExpense);

router.get('/expense/expenses/:pages', userauthentication.authenticate, expenseController.getExpense);

router.post('/expense/delete', userauthentication.authenticate, expenseController.deleteExpense);

router.get('/download/expense', userauthentication.authenticate, expenseController.downloadexpense);

router.get('/download/list', userauthentication.authenticate, expenseController.getdownload);

module.exports = router;