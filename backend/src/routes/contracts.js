const express = require('express');
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

const router = express.Router();

// Example endpoint to interact with a smart contract
router.post('/interact', async (req, res) => {
  const { contractAddress, abi, functionName, args } = req.body;

  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const result = await contract[functionName](...args);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
