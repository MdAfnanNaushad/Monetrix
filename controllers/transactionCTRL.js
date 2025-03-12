const transactionModel = require("../models/transactionModel");
const moment = require("moment");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')

// Get all transactions
// Get all transactions
const fetchTransactions = async (req, res) => {
  try {
    // ✅ Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User ID:", decoded.userId); // Debugging

    // ✅ Check how `userid` is stored in your MongoDB (double-check field name)
    let filter = { userid: decoded.userId };  // If `userId` is different in DB, update it here.

    // ✅ Handle date filtering
    if (req.body.frequency && req.body.frequency !== "custom") {
      filter.date = { 
        $gte: moment().subtract(Number(req.body.frequency), "days").startOf('day').toDate()
      };
    } else if (req.body.selectedDate?.length === 2) {
      filter.date = { 
        $gte: new Date(req.body.selectedDate[0]), 
        $lte: new Date(req.body.selectedDate[1]) 
      };
    }

    // ✅ Ensure type filter is applied correctly
    if (req.body.type && req.body.type !== "all") {
      filter.type = req.body.type;
    }

    console.log("Applying Filter:", filter); // Debugging  

    // ✅ Fetch transactions with correct filters
    const transactions = await transactionModel.find(filter).sort({ date: -1 });

    console.log("Fetched Transactions:", transactions); // Debugging  

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Edit a transaction
const editTransaction = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User ID for Edit:", decoded.userId);

    if (!req.body.transactionId || !req.body.payload) {
      return res.status(400).json({ message: "Transaction ID and payload are required" });
    }


    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionId, userid: decoded.userId }, 
      { $set: req.body.payload },
      { new: true } 
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
  } catch (error) {
    console.error("Edit Transaction Error:", error);
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