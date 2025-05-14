const express = require("express");
const router = express.Router();
const db = require("../models");

let newDate = 1;

async function updatePrice() {
  try {
    const fruitdata = await db.FruitData.findAll();
    for (let fruit of fruitdata) {
      fruit.currentprice = randomUpdatePrice(fruit.initialprice, fruit.currentprice, fruit.RISK);
      await fruit.save();
    }
    return fruitdata;
  } catch (error) {
    throw new Error("Failed to get or update FruitData: " + error.message);
  }
}

function randomUpdatePrice(initialprice, currentprice, risk) {
  initialprice = parseFloat(initialprice);
  currentprice = parseFloat(currentprice);

  if (risk === "low") {
    // -5% to +5%
    currentprice =
      currentprice + currentprice * getRandom(-0.05, 0.05);
  } else if (risk === "medium") {
    // -10% to +10%
    currentprice =
      currentprice + currentprice * getRandom(-0.1, 0.1);
  } else if (risk === "high") {
    //-20% to +20%
    currentprice =
      currentprice + currentprice * getRandom(-0.2, 0.2);
  } else {
    throw new Error(`Invalid risk level: ${risk}`);
  }
  if (currentprice <= initialprice * 0.5){
      // too low from initial price
      currentprice = currentprice + currentprice * getRandom(0, 0.1);
  }
  else if (currentprice >= initialprice * 2){
    // too high from initial price
    currentprice = (currentprice + currentprice * getRandom(-0.1, 0)).toFixed(2);
  }
  return parseFloat(currentprice.toFixed(2));
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

router.post("/", async (req, res) => {
  try {
    const fruitdata = await updatePrice();
    newDate++;
    res.status(200).json({ fruitdata, updateCount: newDate });
  } catch (error) {
    res.status(400).json({ error: "Failed to update FruitData: " + error.message });
  }
});
