const transactionModel = require("../models/transactionModel");
const moment = require("moment");
const mongoose = require("mongoose");

// Get all transactions
const fetchTransactions = async (req, res) => {
  const { frequency, selectedDate, type, userid } = req.body;

  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let filter = { userid };

    if (frequency !== "custom") {
      filter.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate(),
      };
    } else if (selectedDate && selectedDate.length === 2) {
      filter.date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(selectedDate[1]),
      };
    }

    if (type !== "all") {
      filter.type = type;
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
    await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// const viewTransaction = async (req, res) => {
//   try {
//     const transaction = await transactionModel.findOne(
//       { _id: req.body.transactionId },
//       req.body.payload
//     );
//     res.status(200).json(transaction);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

module.exports = {
  fetchTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction
  // viewTransaction,
};