const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server root or project root
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDb = require('./config/connectDb');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors({
  origin: [
    'https://monetrix.onrender.com', // deployed frontend
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',          // Vite default dev port
    'http://localhost:4173'           // Vite preview port
  ],
  credentials: true
}));

// Connect to DB
connectDb();

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoute'));

// Serve static frontend build (Vite generates client/dist, fallback to client/build)
const distPath = path.join(__dirname, '../client/dist');
const buildPath = path.join(__dirname, '../client/build');

app.use(express.static(distPath));
app.use(express.static(buildPath));

app.get('*', function (req, res) {
  const indexPath = require('fs').existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(buildPath, 'index.html');
  res.sendFile(indexPath);
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});