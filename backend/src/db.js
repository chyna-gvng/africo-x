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
    FOREIGN KEY (owner_id) REFERENCES users (id)
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
    db.run('INSERT INTO projects (name, description, location, cctAmount, verification_status, owner_id) VALUES (?, ?, ?, ?, ?, ?)', [name, description, location, cctAmount, false, ownerId], function (err) {
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
};
