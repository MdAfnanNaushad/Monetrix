const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/connectDb');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' })); // Reduce payload limit
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors({
  origin: 'http://localhost:3000', // Ensure frontend is correctly connected
  credentials: true
}));

// Connect to DB
connectDb();

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoute'));

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});