const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const contracts = require('../contracts');
const { ethers } = require('ethers');

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role, depletionRate } = req.body;
  try {
    // Register user in database first to get their address
    const userId = await db.registerUser(username, password, role, depletionRate);

    // Get user's blockchain address
    const userAddress = await db.getUserAddress(username);

    // Set role in blockchain
    await contracts.setRole(username, role);

    // Set depletion rate in blockchain
    if (role === '3') {
      await contracts.setDepletionRate(userAddress, ethers.utils.parseEther(depletionRate.toString()));
    }

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Authenticate a user and issue JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.authenticateUser(username, password);
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'User authenticated successfully', token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
