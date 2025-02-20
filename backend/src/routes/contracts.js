const express = require('express');
const contracts = require('../contracts');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { wallet } = require('../index'); // Import the wallet object
const { ethers } = require('ethers');
const provider = require('../provider');
const fs = require('fs');
const path = require('path');

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

// Load ABIs dynamically
const cctAbiPath = path.join(__dirname, '../../blockchain/build/contracts/CarbonCreditToken.json');
const cctAbi = JSON.parse(fs.readFileSync(cctAbiPath, 'utf8')).abi;

// Set Role by Username
router.post('/setRole', authenticateJWT, async (req, res) => {
  const { username, role } = req.body;
  try {
    await contracts.setRole(username, role);
    res.status(200).json({ message: 'Role set successfully' });
  } catch (err) {
    console.log(err)
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
  const { name, description, location, cctAmount } = req.body;
  const { userId } = req.user;

  try {
    const project_id = await contracts.addProject(name, description, location, cctAmount, userId);
    const userAddress = await db.getUserAddressById(userId);

    // Automatically submit to blockchain
    await contracts.submitProject(project_id, name, userAddress);

    res.status(200).json({ message: 'Project submitted successfully', project_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote for Project
router.post('/voteForProject', authenticateJWT, async (req, res) => {
  const { projectId, voterAddress } = req.body;
  try {
    await contracts.voteForProject(projectId, voterAddress);
    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalize Project
router.post('/finalizeProject', authenticateJWT, async (req, res) => {
  const { projectId } = req.body;
  try {
    // No longer calling contracts.finalizeProject here
    res.status(200).json({ message: 'Project finalization initiated (handled by event listener)' });
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
    // Get user's blockchain address from database
    const userAddress = await contracts.getUserAddress(username);

    // Get ETH balance directly from blockchain
    const ethBalance = await contracts.getEthBalance(userAddress);

    // Get CCT balance from ERC-20 contract
    const cctBalance = await contracts.getCctBalance(userAddress);

    res.status(200).json({ ethBalance, cctBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Role
router.get('/getUserRole', authenticateJWT, async (req, res) => {
  const { username } = req.user;

  try {
    const dbRole = await contracts.getUserRole(username);
    const userAddress = await contracts.getUserAddress(username);
    const contractRole = await contracts.getRole(userAddress);

    res.status(200).json({ dbRole: dbRole, contractRole: contractRole });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// Get All Projects
router.get('/getAllProjects', authenticateJWT, async (req, res) => {
  try {
    const projects = await contracts.getAllProjects();
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Projects By Owner
router.get('/getProjectsByOwner', authenticateJWT, async (req, res) => {
  const { userId } = req.user;
  try {
    const projects = await contracts.getProjectsByOwner(userId);
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Verified Projects
router.get('/getVerifiedProjects', authenticateJWT, async (req, res) => {
  try {
    const projects = await contracts.getVerifiedProjects();
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Unverified Projects
router.get('/getUnverifiedProjects', authenticateJWT, async (req, res) => {
  try {
    const projects = await contracts.getUnverifiedProjects();
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Project
router.post('/verifyProject', authenticateJWT, async (req, res) => {
  const { projectId } = req.body;
  try {
    await contracts.verifyProject(projectId);
    res.status(200).json({ message: 'Project verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Project CCT Amount
router.post('/updateProjectCctAmount', authenticateJWT, async (req, res) => {
  const { projectId, cctAmount } = req.body;
  try {
    await contracts.updateProjectCctAmount(projectId, cctAmount);
    res.status(200).json({ message: 'Project CCT amount updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Address
router.get('/getUserAddress', authenticateJWT, async (req, res) => {
  const { username } = req.user;
  try {
    const userAddress = await contracts.getUserAddress(username);
    res.status(200).json({ userAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purchase CCT
router.post('/purchaseCCT', authenticateJWT, async (req, res) => {
  const { buyerAddress, ownerAddress, ethAmount } = req.body;
  try {
    const { username } = req.user; // Get username from JWT

    // 1. Get the buyer's private key from the database
    const buyerPrivateKey = await db.getUserPrivateKey(username);

    // Log the buyer details for debugging
    console.log("Buyer Address:", buyerAddress);
    console.log("Owner Address:", ownerAddress);
    console.log("Buyer Private Key:", buyerPrivateKey); // WARNING: LOGGING PRIVATE KEY

    // 2. Create a new wallet instance using the buyer's private key
    const buyerWallet = new ethers.Wallet(buyerPrivateKey, provider);

    // Transfer ETH from buyer to owner
    const ethTx = await buyerWallet.sendTransaction({
      to: ownerAddress,
      value: ethers.utils.parseEther(ethAmount.toString())
    });
    await ethTx.wait();

    // 3. Get the owner's private key from the database
    const ownerUsername = await db.getUsernameFromAddress(ownerAddress);
    const ownerPrivateKey = await db.getUserPrivateKey(ownerUsername);

    // Log the owner details for debugging
    console.log("Owner Address:", ownerAddress);
    console.log("Owner Username:", ownerUsername);
    console.log("Owner Private Key:", ownerPrivateKey); // WARNING: LOGGING PRIVATE KEY

    // 4. Create a wallet instance for the owner
    const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);

    // 5. Create a contract instance connected to the owner's wallet
    const cctContractWithSigner = new ethers.Contract(process.env.CCT_ADDRESS, cctAbi, ownerWallet);

    // 6. Calculate CCT amount in Wei
    const cctAmountWei = ethers.utils.parseEther(ethAmount.toString());

    // 7. Check if the owner has enough CCT tokens
    const ownerCctBalance = await contracts.getCctBalance(ownerAddress);
    if (parseFloat(ownerCctBalance) < parseFloat(ethAmount)) {
      return res.status(400).json({ error: 'Owner does not have enough CCT tokens' });
    }

    // 8. Transfer CCT from owner to buyer
    try {
      const cctTx = await cctContractWithSigner.transfer(buyerAddress, cctAmountWei);
      await cctTx.wait();
      console.log("CCT Transfer Transaction Hash:", cctTx.hash);
    } catch (cctTransferError) {
      console.error("CCT Transfer Error:", cctTransferError);
      return res.status(500).json({ error: 'CCT transfer failed', details: cctTransferError.message });
    }

    res.status(200).json({ message: 'CCT purchased successfully' });
  } catch (err) {
    console.error("Purchase CCT error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
