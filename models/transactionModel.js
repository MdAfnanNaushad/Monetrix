const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userid:{
      type:String,
      required: true,

    },
    amount: {
      type: Number,
      required: [true, 'Please add a positive or negative number']
    },
    type:{
      type: String,
      required: [true, 'Please add a type'],
      lowercase: true
    },
    category: {
      type: String,
      required: [true, 'Please add some text']
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true } 
);

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;