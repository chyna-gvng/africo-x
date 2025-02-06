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
    address TEXT,
    role TEXT
  )`);
});

// Register a new user
function registerUser(username, password, role) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        reject(err);
      } else {
        // Get the address from Ganache based on userId
        const accounts = await provider.listAccounts();
        db.run('INSERT INTO users (username, password, address, role) VALUES (?, ?, ?, ?)', [username, hash, accounts[0], role], function (err) {
          if (err) {
            reject(err);
          } else {
            const userId = this.lastID;
            const userAddress = accounts[userId - 1];
            db.run('UPDATE users SET address = ? WHERE id = ?', [userAddress, userId], function (err) {
              if (err) {
                reject(err);
              } else {
                resolve(userId);
              }
            });
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

// Get user address
function getUserAddress(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT address FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row.address);
      } else {
        reject(new Error('User not found'));
      }
    });
  });
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserAddress,
};
