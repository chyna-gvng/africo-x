const express = require('express');
const contracts = require('../contracts');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Set Role
router.post('/setRole', authenticateJWT, async (req, res) => {
  const { user, role } = req.body;
  try {
    await contracts.setRole(user, role);
    res.status(200).json({ message: 'Role set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mint Tokens
router.post('/mint', authenticateJWT, async (req, res) => {
  const { account, amount } = req.body;
  try {
    await contracts.mint(account, amount);
    res.status(200).json({ message: 'Tokens minted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Burn Tokens
router.post('/burn', authenticateJWT, async (req, res) => {
  const { amount } = req.body;
  try {
    await contracts.burn(amount);
    res.status(200).json({ message: 'Tokens burned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set Depletion Rate
router.post('/setDepletionRate', authenticateJWT, async (req, res) => {
  const { buyer, rate } = req.body;
  try {
    await contracts.setDepletionRate(buyer, rate);
    res.status(200).json({ message: 'Depletion rate set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Project
router.post('/submitProject', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  try {
    await contracts.submitProject(name);
    res.status(200).json({ message: 'Project submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote for Project
router.post('/voteForProject', authenticateJWT, async (req, res) => {
  const { projectId } = req.body;
  try {
    await contracts.voteForProject(projectId);
    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalize Project
router.post('/finalizeProject', authenticateJWT, async (req, res) => {
  const { projectId } = req.body;
  try {
    await contracts.finalizeProject(projectId);
    res.status(200).json({ message: 'Project finalized successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Role
router.get('/getRole', authenticateJWT, async (req, res) => {
  const { user } = req.query;
  try {
    const role = await contracts.getRole(user);
    res.status(200).json({ role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project Details
router.get('/getProject', authenticateJWT, async (req, res) => {
  const { projectId } = req.query;
  try {
    const project = await contracts.getProject(projectId);
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Total Eligible Votes
router.get('/getTotalEligibleVotes', authenticateJWT, async (req, res) => {
  try {
    const totalVotes = await contracts.getTotalEligibleVotes();
    res.status(200).json({ totalVotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Eligible Voter Count
router.get('/getEligibleVoterCount', authenticateJWT, async (req, res) => {
  try {
    const voterCount = await contracts.getEligibleVoterCount();
    res.status(200).json({ voterCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check Voter Eligibility
router.get('/isEligibleVoter', authenticateJWT, async (req, res) => {
  const { voter } = req.query;
  try {
    const isEligible = await contracts.isEligibleVoter(voter);
    res.status(200).json({ isEligible });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if Address Has Voted
router.get('/hasAddressVoted', authenticateJWT, async (req, res) => {
  const { projectId, voter } = req.query;
  try {
    const hasVoted = await contracts.hasAddressVoted(projectId, voter);
    res.status(200).json({ hasVoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ethereum Balance
router.get('/getEthBalance', authenticateJWT, async (req, res) => {
  const { userAddress } = req.query;
  try {
    const balance = await contracts.getEthBalance(userAddress);
    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get CCT Balance
router.get('/getCctBalance', authenticateJWT, async (req, res) => {
  const { userAddress } = req.query;
  try {
    const balance = await contracts.getCctBalance(userAddress);
    res.status(200).json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Balances
router.get('/getUserBalances', authenticateJWT, async (req, res) => {
  const { username } = req.user;
  try {
    const userAddress = await contracts.getUserAddress(username);
    const ethBalance = await contracts.getEthBalance(userAddress);
    const cctBalance = await contracts.getCctBalance(userAddress);
    res.status(200).json({ ethBalance, cctBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
