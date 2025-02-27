const express = require('express');
const { 
    addTransaction, 
    getAllTransactions,
    editTransaction,
    deleteTransaction
 } = require('../controllers/transactionCTRL');

//router object
const router = express.Router();


//add transaction
router.post('/add-transaction', addTransaction);

//add transaction
router.post('/edit-transaction', editTransaction);

//delete Tranaction
router.post('/delete-transaction', deleteTransaction);

//get transaction
router.post('/get-transactions', getAllTransactions);

module.exports = router; // Because of ES6 module system