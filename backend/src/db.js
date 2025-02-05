const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');

const db = new sqlite3.Database('./database.sqlite');

// Connect to Ganache instance
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    address TEXT
  )`);
});

// Register a new user
function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        reject(err);
      } else {
        // Get the address from Ganache
        const accounts = await provider.listAccounts();
        db.run('INSERT INTO users (username, password, address) VALUES (?, ?, ?)', [username, hash, accounts[0]], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
}

// Authenticate a user
function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        bcrypt.compare(password, row.password, (err, result) => {
          if (err) {
            reject(err);
          } else if (result) {
            resolve(row);
          } else {
            reject(new Error('Invalid password'));
          }
        });
      } else {
        reject(new Error('User not found'));
      }
    });
  });
}

module.exports = {
  registerUser,
  authenticateUser,
};
