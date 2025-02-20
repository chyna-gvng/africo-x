const { ethers } = require('ethers');
const provider = require('./provider'); // Import the provider
const fs = require('fs');
const path = require('path');
const db = require('./db');
require('dotenv').config();

// Load private key and provider URL from environment variables
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Load ABIs dynamically
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

async function mint(account, amount) {
  const tx = await cctContract.mint(account, ethers.utils.parseEther(amount.toString()));
  await tx.wait();
  return tx;
}

async function burn(amount) {
  const tx = await cctContract.burn(amount);
  await tx.wait();
  return tx;
}

async function setDepletionRate(buyer, rate) {
  const tx = await cctContract.setDepletionRate(buyer, rate);
  await tx.wait();
  return tx;
}

async function submitProject(projectId, name, ownerAddress) {
  const tx = await prContract.submitProject(projectId, name, ownerAddress);
  await tx.wait();
  return tx;
}

async function voteForProject(projectId, voterAddress) {
  const tx = await prContract.voteForProject(projectId, voterAddress);
  await tx.wait();
  return tx;
}

async function finalizeProject(projectId) {
  const tx = await prContract.finalizeProject(projectId);
  await tx.wait();
  return tx;
}

async function getProject(projectId) {
  const project = await prContract.projects(projectId);
  return {
    name: project.name,
    owner: project.owner,
    project_id: project.project_id,
    voteWeight: project.voteWeight,
    registered: project.registered,
  };
}

async function getTotalEligibleVotes() {
  return await prContract.getTotalEligibleVotes();
}

async function getEligibleVoterCount() {
  return await prContract.getEligibleVoterCount();
}

async function isEligibleVoter(voter) {
  return await prContract.isEligibleVoter(voter);
}

async function hasAddressVoted(projectId, voter) {
  return await prContract.hasAddressVoted(projectId, voter);
}

async function getEthBalance(userAddress) {
  const balance = await provider.getBalance(userAddress);
  return ethers.utils.formatEther(balance);
}

async function getCctBalance(userAddress) {
  // Query the CCT ERC-20 contract's balanceOf function
  const balance = await cctContract.balanceOf(userAddress);
  // Convert from wei (1e18) to whole tokens using formatEther
  return ethers.utils.formatEther(balance);
}

async function getUserAddress(username) {
  return await db.getUserAddress(username);
}

async function getUserRole(username) {
  return await db.getUserRole(username);
}

async function getRole(userAddress) {
  return await cctContract.getRole(userAddress);
}

async function setRole(username, role) {
  // Get user's blockchain address from database
  const userAddress = await db.getUserAddress(username);

  // Update role in blockchain
  const tx = await cctContract.setRole(userAddress, role);
  await tx.wait();

  // Update role in database
  await db.setUserRole(username, role);

  return tx;
}

async function addProject(name, description, location, cctAmount, ownerId) {
  return await db.addProject(name, description, location, cctAmount, ownerId);
}

async function getAllProjects() {
  return await db.getAllProjects();
}

async function getProjectsByOwner(ownerId) {
  return await db.getProjectsByOwner(ownerId);
}

async function getVerifiedProjects() {
  return await db.getVerifiedProjects();
}

async function getUnverifiedProjects() {
  return await db.getUnverifiedProjects();
}

async function verifyProject(projectId) {
  const project = await db.getProjectById(projectId);
  const ownerAddress = await db.getUserAddressById(project.owner_id);
  await mint(ownerAddress, project.cctAmount);
  return await db.verifyProject(projectId);
}

async function updateProjectCctAmount(projectId, cctAmount) {
  return await db.updateProjectCctAmount(projectId, cctAmount);
}

async function archiveProject(projectId) {
  const tx = await prContract.archiveProject(projectId);
  await tx.wait();
  return tx;
}

module.exports = {
  mint,
  burn,
  setDepletionRate,
  submitProject,
  voteForProject,
  finalizeProject,
  getProject,
  getTotalEligibleVotes,
  getEligibleVoterCount,
  isEligibleVoter,
  hasAddressVoted,
  getEthBalance,
  getCctBalance,
  getUserAddress,
  getUserRole,
  getRole,
  setRole,
  addProject,
  getAllProjects,
  getProjectsByOwner,
  getVerifiedProjects,
  getUnverifiedProjects,
  verifyProject,
  updateProjectCctAmount,
  archiveProject // ADD THIS LINE
};
