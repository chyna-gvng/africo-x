const { ethers } = require('ethers');
require('dotenv').config();

// Load provider URL from environment variables
const providerUrl = process.env.PROVIDER_URL;

// Check if PROVIDER_URL is defined
if (!providerUrl) {
    console.error("PROVIDER_URL environment variable not set.");
    process.exit(1); // Exit if the URL is not set
}

const provider = new ethers.providers.JsonRpcProvider(providerUrl);

module.exports = provider;
