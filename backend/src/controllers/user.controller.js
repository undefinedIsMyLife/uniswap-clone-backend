const userService = require("../services/user.service");

// Create User
async function createUser(req, res) {
  try {
    const { wallet } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // Prevent duplicates
    const user = await userService.createUser(wallet);

    if (user.error === "USER_EXISTS") {
      return res.status(400).json({ error: "User already exists with this wallet" });
    }

    res.json(user);

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

// Get all users
async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

module.exports = { createUser, getUsers };
