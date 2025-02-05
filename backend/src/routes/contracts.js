const express = require('express');
const contracts = require('../contracts');

const router = express.Router();

// Set Role
router.post('/setRole', async (req, res) => {
  const { user, role } = req.body;
  try {
    await contracts.setRole(user, role);
    res.status(200).json({ message: 'Role set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mint Tokens
router.post('/mint', async (req, res) => {
  const { account, amount } = req.body;
  try {
    await contracts.mint(account, amount);
    res.status(200).json({ message: 'Tokens minted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Burn Tokens
router.post('/burn', async (req, res) => {
  const { amount } = req.body;
  try {
    await contracts.burn(amount);
    res.status(200).json({ message: 'Tokens burned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set Depletion Rate
router.post('/setDepletionRate', async (req, res) => {
  const { buyer, rate } = req.body;
  try {
    await contracts.setDepletionRate(buyer, rate);
    res.status(200).json({ message: 'Depletion rate set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Project
router.post('/submitProject', async (req, res) => {
  const { name } = req.body;
  try {
    await contracts.submitProject(name);
    res.status(200).json({ message: 'Project submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote for Project
router.post('/voteForProject', async (req, res) => {
  const { projectId } = req.body;
  try {
    await contracts.voteForProject(projectId);
    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalize Project
router.post('/finalizeProject', async (req, res) => {
  const { projectId } = req.body;
  try {
    await contracts.finalizeProject(projectId);
    res.status(200).json({ message: 'Project finalized successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Role
router.get('/getRole', async (req, res) => {
  const { user } = req.query;
  try {
    const role = await contracts.getRole(user);
    res.status(200).json({ role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project Details
router.get('/getProject', async (req, res) => {
  const { projectId } = req.query;
  try {
    const project = await contracts.getProject(projectId);
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Total Eligible Votes
router.get('/getTotalEligibleVotes', async (req, res) => {
  try {
    const totalVotes = await contracts.getTotalEligibleVotes();
    res.status(200).json({ totalVotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Eligible Voter Count
router.get('/getEligibleVoterCount', async (req, res) => {
  try {
    const voterCount = await contracts.getEligibleVoterCount();
    res.status(200).json({ voterCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check Voter Eligibility
router.get('/isEligibleVoter', async (req, res) => {
  const { voter } = req.query;
  try {
    const isEligible = await contracts.isEligibleVoter(voter);
    res.status(200).json({ isEligible });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if Address Has Voted
router.get('/hasAddressVoted', async (req, res) => {
  const { projectId, voter } = req.query;
  try {
    const hasVoted = await contracts.hasAddressVoted(projectId, voter);
    res.status(200).json({ hasVoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
