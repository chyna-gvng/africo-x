const express = require('express');
const { ethers } = require('ethers');
const db = require('./db');
const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Ganache instance
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/contracts', contractRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
