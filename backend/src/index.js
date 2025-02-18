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

// Load private key and provider URL from environment variables
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/contracts', contractRoutes);

// Load ABIs dynamically
const fs = require('fs');
const path = require('path');
const cctAbiPath = path.join(__dirname, '../../blockchain/build/contracts/CarbonCreditToken.json');
const prAbiPath = path.join(__dirname, '../../blockchain/build/contracts/ProjectRegistration.json');

const cctAbi = JSON.parse(fs.readFileSync(cctAbiPath, 'utf8')).abi;
const prAbi = JSON.parse(fs.readFileSync(prAbiPath, 'utf8')).abi;

// CarbonCreditToken Address
const cctAddress = process.env.CCT_ADDRESS;
const cctContract = new ethers.Contract(cctAddress, cctAbi, wallet);

// ProjectRegistration Address
const prAddress = process.env.PR_ADDRESS;
const prContract = new ethers.Contract(prAddress, prAbi, wallet);

// Event Listener
prContract.on("VoteCast", async (projectId, voter, weight) => {
  console.log(`VoteCast event received: Project ID: ${projectId}, Voter: ${voter}, Weight: ${weight}`);
  try {
    // Get the updated voteWeight from the blockchain
    const project = await prContract.projects(projectId);
    const voteWeight = project.voteWeight;

    // Update the voteWeight in the database
    await db.updateProjectVoteWeight(projectId.toNumber(), voteWeight.toString());

    // Check if voteWeight is over 50% and finalize the project
    const totalEligibleVotes = await prContract.getTotalEligibleVotes();
    const requiredVotes = totalEligibleVotes.div(ethers.BigNumber.from("2"));

    console.log(`Project ${projectId}: Vote Weight = ${voteWeight.toString()}, Required Votes = ${requiredVotes.toString()}`); // Add debug log

    if (voteWeight.gt(requiredVotes) && !project.registered) {
      console.log(`Vote weight exceeds 50% for project ${projectId}. Finalizing...`);

      // Call the finalizeProject function
      try {
        const tx = await prContract.finalizeProject(projectId);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Project ${projectId} finalized successfully.`);

        // Mint CCT tokens to the project owner
        const projectDetails = await db.getProjectById(projectId.toNumber());
        const ownerAddress = await db.getUserAddressById(projectDetails.owner_id);
        const cctAmount = projectDetails.cctAmount;

        const mintTx = await cctContract.mint(ownerAddress, ethers.utils.parseEther(cctAmount.toString()));
        await mintTx.wait();
        console.log(`Minted ${cctAmount} CCT tokens to project owner ${ownerAddress}`);

        // Update verification_status in the database
        await db.verifyProject(projectId.toNumber());
        console.log(`Project ${projectId} verification_status updated in database.`);

      } catch (finalizeError) {
        console.error(`Error finalizing project ${projectId}:`, finalizeError);
      }
    }
  } catch (error) {
    console.error("Error updating vote weight or finalizing project:", error);
  }
});

// Initial Vote Weight Synchronization (Important for Existing Projects):
async function syncVoteWeights() {
  try {
    const projects = await db.getAllProjects();
    for (const project of projects) {
      const blockchainProject = await prContract.projects(project.project_id);
      const voteWeight = blockchainProject.voteWeight;
      await db.updateProjectVoteWeight(project.project_id, voteWeight.toString());
      console.log(`Synced voteWeight for project ${project.project_id} to ${voteWeight.toString()}`);
    }
    console.log("Vote weights synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing vote weights:", error);
  }
}

syncVoteWeights(); // Call the function to synchronize vote weights

module.exports = { wallet };

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
