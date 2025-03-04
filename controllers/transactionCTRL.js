const transactionModel = require("../models/transactionModel");
const moment = require("moment");
const mongoose = require("mongoose");

// Get all transactions
const fetchTransactions = async (req, res) => {
  try {
    let filter = { userid: req.userId };

    if (req.body.frequency !== "custom") {
      filter.date = { $gt: moment().subtract(Number(req.body.frequency), "days").toDate() };
    } else if (req.body.selectedDate?.length === 2) {
      filter.date = { $gte: new Date(req.body.selectedDate[0]), $lte: new Date(req.body.selectedDate[1]) };
    }

    if (req.body.type !== "all") {
      filter.type = req.body.type;
    }

    const transactions = await transactionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Edit a transaction
const editTransaction = async (req, res) => {
  try {
    if (!req.body.transactionId || !req.body.payload) {
      return res.status(400).json({ message: "Transaction ID and payload are required" });
    }

    await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.status(200).json({ message: "Edit Successful" });
  } catch (error) {
    console.log("Edit Transaction Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel({ ...req.body, userid: req.userId });
    await newTransaction.save();
    res.status(201).json({ message: "Transaction Created" });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { fetchTransactions, addTransaction };

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    if (!req.body.transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).json({ message: "Transaction Deleted" });
  } catch (error) {
    console.log("Delete Transaction Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  fetchTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
};