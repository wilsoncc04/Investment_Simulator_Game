const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ error: "Authorization header missing" });
//   }
//   const token = authHeader.split(" ")[1]; // Bearer <token>
//   if (!token) {
//     return res.status(401).json({ error: "Access token required" });
//   }

//   verify(token, "testtest", (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: "Invalid token" });
//     }
//     req.user = user;
//     next();
//   });
// };

// Register route
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const hash = await bcrypt.hash(password, 10); // Use await for bcrypt.hash
    await db.User.create({
      username,
      pw: hash,
      money: 5000, // Set initial money
    });
    return res.status(200).json("success");
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(400).json({ error: "Failed to register" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.pw);
    if (!match) {
      return res.status(401).json({ error: "Wrong username or password" });
    }
    // const accessToken = sign(
    //   { username: user.username, id: user.id },
    //   "testtest",
    // );
    console.log(`User ${username} logged in successfully`);
    return res
      .status(200)
      .json({ money: user.currentmoney || 5000 });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
});

// Get user's money
router.get("/money", async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ money: user.currentmoney || 5000 });
  } catch (error) {
    console.error("Error fetching money:", error);
    res.status(400).json({ error: "Failed to fetch money" });
  }
});


// Update user's money
router.post("/money", async (req, res) => {
  try {
    const { money,username } = req.body;
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.currentmoney= money;
    await user.save();
    console.log(`User ${user.username} updated money to ${money}`);
    return res.status(200).json({ message: "Money updated", money });
  } catch (error) {
    console.error("Error updating money:", error);
    return res.status(400).json({ error: "Failed to update money" });
  }
});

module.exports = router;
