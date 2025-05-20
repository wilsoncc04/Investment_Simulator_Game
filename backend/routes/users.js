const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const {sign} = require("jsonwebtoken");

router.post("/", async (req, res) => {
  //register
  try {
    const { username, password } = req.body;
    const existingUser = await db.User.findOne({
      where: { username: username },
    });
    if (existingUser) {
      console.log("Username already exists");
      return res.status(409).json({ error: "Username already exists" });
    }
    
    bcrypt.hash(password, 10).then((hash) => {
      db.User.create({
        username: username,
        pw: hash,
      });
      res.status(200).json("success");
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Failed to register");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.User.findOne({ where: { username: username } });
    if (!user) {
      return res.json({ error: "user does not exist" });
    } else {
      bcrypt
        .compare(password, user.pw)
        .then((match) => {
          if (!match) {
            return res.json({ error: "wrong username or password" });
          }
          const accessToken = sign({username: user.username, id:user.id}, "testtest");
          return res.json(accessToken);
        })
        .catch((error) => {
          console.error("Bcrypt compare error:", err);
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to login");
  }
});
module.exports = router;
