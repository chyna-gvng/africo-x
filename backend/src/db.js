const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');
const crypto = require('crypto');
const provider = require('./provider'); // Import the provider

const db = new sqlite3.Database('./database.sqlite');

// Encryption key (keep this secret and manage securely)
const AES_SECRET_KEY = process.env.AES_SECRET_KEY;
if (!AES_SECRET_KEY) {
  console.error("AES_SECRET_KEY environment variable not set.");
  process.exit(1); // Exit if the key is not set
}

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    address TEXT,
    private_key TEXT,
    role INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    location TEXT,
    cctAmount INTEGER,
    verification_status BOOLEAN,
    owner_id INTEGER,
    voteWeight TEXT DEFAULT '0',  -- Changed to TEXT
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);
});

// Function to encrypt private key
function encrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${key.toString('hex')}`;
}

// Function to decrypt private key
function decrypt(encryptedText) {
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const key = Buffer.from(parts.pop(), 'hex');
    const encryptedData = Buffer.from(parts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

// Register a new user
function registerUser(username, password, role) {
  return new Promise(async (resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // Get the mnemonic phrase from the environment variables
        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
          reject(new Error("MNEMONIC environment variable not set."));
          return;
        }

        // Insert user data into the database
        db.run(
          'INSERT INTO users (username, password, address, private_key, role) VALUES (?, ?, ?, ?, ?)',
          [username, hash, null, null, role], // Temporarily set address and private_key to null
          async function (err) { // Make the callback async
            if (err) {
              reject(err);
              return;
            }

            const userId = this.lastID; // Get the auto-incremented user ID
            const userIndex = userId - 1; // Correctly calculate the index

            // Derive the wallet from the mnemonic and user index
            const wallet = ethers.Wallet.fromMnemonic(
              mnemonic,
              `m/44'/60'/0'/0/${userIndex}`
            );
            const userAddress = wallet.address;
            const userPrivateKey = wallet.privateKey;

            // Encrypt the private key
            const encryptedPrivateKey = encrypt(userPrivateKey);

            // Update the user record with the address and encrypted private key
            db.run(
              'UPDATE users SET address = ?, private_key = ? WHERE id = ?',
              [userAddress, encryptedPrivateKey, userId],
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(userId); // Resolve with the new user ID
              }
            );
          }
        );
      } catch (ganacheErr) {
        console.error("Error getting Ganache account:", ganacheErr);
        reject(new Error("Failed to retrieve Ganache account."));
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
    db.get('SELECT address, private_key FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        // Decrypt the private key (FOR DEMONSTRATION ONLY - AVOID THIS IN PRODUCTION)
        // const decryptedPrivateKey = decrypt(row.private_key);
        // console.log("Decrypted Private Key:", decryptedPrivateKey);

        resolve(row.address); // Return the address
      } else {
        reject(new Error('User not found'));
      }
    });
  });
}

// Get user role
function getUserRole(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT role FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row.role);
      } else {
        reject(new Error('User not found'));
      }
    });
  });
}

// Set user role
function setUserRole(username, role) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET role = ? WHERE username = ?', [role, username], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Add a new project
function addProject(name, description, location, cctAmount, ownerId) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO projects (name, description, location, cctAmount, verification_status, owner_id, voteWeight) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, description, location, cctAmount, false, ownerId, '0'], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Get all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get projects by owner
function getProjectsByOwner(ownerId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects WHERE owner_id = ?', [ownerId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get verified projects
function getVerifiedProjects() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects WHERE verification_status = ?', [true], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get unverified projects
function getUnverifiedProjects() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects WHERE verification_status = ?', [false], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Verify a project
function verifyProject(projectId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE projects SET verification_status = ? WHERE project_id = ?', [true, projectId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Update project CCT amount
function updateProjectCctAmount(projectId, cctAmount) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE projects SET cctAmount = ? WHERE project_id = ?', [cctAmount, projectId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Get project by ID
function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM projects WHERE project_id = ?', [projectId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        reject(new Error('Project not found'));
      }
    });
  });
}

// Get user address by ID
function getUserAddressById(userId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT address FROM users WHERE id = ?', [userId], (err, row) => {
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

// Update project vote weight
function updateProjectVoteWeight(projectId, voteWeight) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE projects SET voteWeight = ? WHERE project_id = ?', [voteWeight.toString(), projectId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Get user private key
function getUserPrivateKey(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT private_key FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        // Decrypt the private key
        const decryptedPrivateKey = decrypt(row.private_key);
        resolve(decryptedPrivateKey);
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
  getUserRole,
  setUserRole,
  addProject,
  getAllProjects,
  getProjectsByOwner,
  getVerifiedProjects,
  getUnverifiedProjects,
  verifyProject,
  updateProjectCctAmount,
  getProjectById,
  getUserAddressById,
  getUserPrivateKey,
  updateProjectVoteWeight,
};
