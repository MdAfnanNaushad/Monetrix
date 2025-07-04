const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/connectDb');
const path = require('path');
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors({
  origin: [
    'https://monetrix.onrender.com', // your deployed frontend
    'http://localhost:3000',          // React default dev server
    'http://localhost:3001'           // if you use this port for frontend
  ],
  credentials: true
}));

// Connect to DB
connectDb();

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoute'));

// Serve static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});