const express = require('express');
const db = require('../db');

const router = express.Router();

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

// Authenticate a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.authenticateUser(username, password);
    res.status(200).json({ message: 'User authenticated successfully', user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
