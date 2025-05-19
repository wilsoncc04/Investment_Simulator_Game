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

//get warehouse data
router.get("/warehouse", async (req, res) => {
  try {
    const warehouse = await db.Warehouse.findAll();
    res.status(200).json(warehouse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get warehouse data" });
  }
});

// Update warehouse (purchase or selling)
router.post("/warehouse", async (req, res) => {
  try {
    const changes = req.body;
    for (const record of changes) {
      const fruit = await db.Warehouse.findOne({
        where: { fruitname: record.fruitname },
      });
      if (fruit) {
        await db.Warehouse.update(
          { amount: parseInt(fruit.amount) + parseInt(record.amount) },
          { where: { fruitname: record.fruitname } }
        );
      }
    }
    res.status(200).json({ message: "Warehouse updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json("Failed to update warehouse");
  }
});

// Get transaction record
router.get("/transaction", async (req, res) => {
  try {
    const transactionRecord = await db.TransactionRecord.findAll({
      order: [["id", "DESC"]],
      attributes: ["id","fruitname", "amount", "price", "DateofTsc"],
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
router.get("/fruitrecord/:fruitname", async (req, res) => {
  const FruitPriceRecord = await db;
});

module.exports = router;
