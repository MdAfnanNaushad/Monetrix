const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    reference: { type: String },
    description: { type: String, required: true },
    date: { type: Date, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

// transactionRoutes.js
const express = require('express');
const { addTransaction, fetchTransactions, editTransaction, deleteTransaction } = require('../controllers/transactionCTRL');
const router = express.Router();

router.post('/add-transaction', addTransaction);
router.post('/edit-transaction', editTransaction);
router.post('/delete-transaction', deleteTransaction);
router.post('/get-transactions', fetchTransactions);

module.exports = router;
