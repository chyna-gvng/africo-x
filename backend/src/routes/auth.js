const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userId = await db.registerUser(username, password);
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
