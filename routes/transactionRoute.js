const express = require('express');
const { 
    addTransaction, 
    fetchTransactions,
    editTransaction,
    deleteTransaction,
   
 } = require('../controllers/transactionCTRL');
 const authMiddleware = require('../middlewares/authMiddleware')

//router object
const router = express.Router();


//add transaction
router.post('/add-transaction',authMiddleware, addTransaction);

//add transaction
router.post('/edit-transaction',authMiddleware, editTransaction);

//delete Tranaction
router.post('/delete-transaction',authMiddleware, deleteTransaction);

//get transaction
router.post('/get-transactions',authMiddleware, fetchTransactions);

//view Transaction
// router.post('/view-transaction')

module.exports = router; // Because of ES6 module system