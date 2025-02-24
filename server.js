const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/connectDb');
dotenv.config();

//middleware
app.use(morgan('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());
connectDb();
//userRoutes
app.use('/api/v1/users',require('./routes/userRoute'))

app.use('/api/v1/transactions', require('./routes/transactionRoute'));


app.listen(3003, () => {
  console.log('listening on port 3003');
});