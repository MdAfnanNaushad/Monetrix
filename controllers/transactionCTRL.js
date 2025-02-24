const transactionModel = require('../models/transactionModel');
const moment = require('moment')
const getAllTransactions = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body
        const transactions = await transactionModel.find({
            ...(frequency !== 'custom' ? {
                date:
                    { $gte: moment().subtract(1, frequency).toDate() }
            } : {
                date: {
                    $gte: selectedDate[0],
                    $lte: moment(selectedDate[1])
                }
            }),
            userid: req.body.userid,
            ...(type !== 'all' && { type })
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }
}

const editTransaction = async (req, res) => {
    try {
        const { _id, ...rest } = req.body;
        await transactionModel.findByIdAndUpdate({ _id }, rest);
        res.status(200).send('Transaction Updated');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndDelete({_id:req.body.transactionId});
        res.status(200).send('Transaction Deleted');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const addTransaction = async (req, res) => {
    try {
       await transactionModel.findOneAndUpdate(
        {_id: req.body._id }, 
        req.body.payload)
    res.status(200).send('Transaction Editted succesFully');

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
module.exports = {
    getAllTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
};