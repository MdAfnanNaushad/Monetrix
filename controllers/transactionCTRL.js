const transactionModel = require('../models/transactionModel');
const moment = require('moment');

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const { frequency, selectedDate, type, userid } = req.body;
        let filter = { userid };

        if (frequency !== 'custom') {
            filter.date = { $gte: moment().subtract(Number(frequency), 'days').toDate() };
        } else {
            filter.date = {
                $gte: moment(selectedDate[0]).startOf('day').toDate(),
                $lte: moment(selectedDate[1]).endOf('day').toDate(),
            };
        }

        if (type !== 'all') filter.type = type;

        const transactions = await transactionModel.find(filter);
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Add a transaction
const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).json({ message: "Transaction Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Edit a transaction
const editTransaction = async (req, res) => {
    try {
        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await transactionModel.findOne({ _id: req.body.transactionId, userid: req.body.userid });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or unauthorized" });
        }

        await transactionModel.findByIdAndDelete(req.body.transactionId);
        res.status(200).json({ message: "Transaction Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    getAllTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
};
