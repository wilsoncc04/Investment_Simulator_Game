const express = require("express");
const router = express.Router();
const db = require("../models"); // Import models from models/index.js

// Get all fruit data
router.get("/fruitdata", async (req, res) => {
  try {
    const fruitdata = await db.FruitData.findAll();
    res.status(200).json(fruitdata); // Use 200 for retrieval
  } catch (error) {
    console.error("Error in GET /fruitdata:", error);
    res.status(500).json({ error: "Failed to get fruits data" });
  }
});


// Update current price
router.post("/fruitdata", async (req, res) => {
  try {
    const { fruitname, currentprice } = req.body;
    // Validate input
    if (!fruitname || currentprice === undefined) {
      return res.status(400).json({ error: "fruitname and currentprice are required" });
    }
    // Update currentprice
    const [updatedCount, updatedFruits] = await db.FruitData.update(
      { currentprice },
      {
        where: { fruitname },
        returning: true, // Return the updated record (MySQL/PostgreSQL)
      }
    );
    // Check if the fruit was found and updated
    if (updatedCount === 0) {
      return res.status(404).json({ error: "Fruit not found" });
    }
    res.status(200).json(updatedFruits[0]); // Return the updated fruit
  } catch (error) {
    res.status(400).json({ error: "Failed to update fruit price" });
  }
});

// Get transaction record
router.get("/transaction", async (req, res) => {
  try {
    const transactionRecord = await db.TransactionRecord.findAll({
      attributes: ["fruitname", "amount", "price" ,"DateofTsc"],
    });
    res.status(200).json(transactionRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to get transaction record" });
  }
});

// Post new transaction record
router.post("/transaction", async (req, res) => {
  try {
    const transactions = req.body;
    const createdRecords = await db.TransactionRecord.bulkCreate(transactions);
    res.status(201).json(createdRecords);
  } catch (error) {
    console.log(error);
    console.log(req.body);
    res.status(400).json({ error: "Failed to create new transaction record" });
  }
});

//not finished - get fruit price trend
router.get("/fruitrecord/:fruitname", async (req,res)=>{
  const FruitPriceRecord = await db; 
}) 

module.exports = router;