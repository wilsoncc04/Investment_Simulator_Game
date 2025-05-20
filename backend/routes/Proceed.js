const express = require("express");
const router = express.Router();
const db = require("../models");

let newDate = 1;

async function updatePrice() {
  try {
    const fruitdata = await db.FruitData.findAll({order: [["RISK","ASC"]]});
    for (let fruit of fruitdata) {
      fruit.currentprice = randomUpdatePrice(
        fruit.initialprice,
        fruit.currentprice,
        fruit.RISK
      );
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
      currentprice +
      currentprice * getRandom(-0.05, 0.05, initialprice, currentprice, 1000);
  } else if (risk === "medium") {
    // -10% to +10%
    currentprice =
      currentprice +
      currentprice * getRandom(-0.1, 0.1, initialprice, currentprice, 330);
  } else if (risk === "high") {
    //-20% to +20%
    currentprice =
      currentprice +
      currentprice * getRandom(-0.2, 0.2, initialprice, currentprice, 90);
  }
  if (currentprice <= initialprice * 0.6) {
    // too low from initial price
    currentprice = currentprice + currentprice * getRandom(0, 0.1);
  } else if (currentprice >= initialprice * 1.7) {
    // too high from initial price
    currentprice = (currentprice + currentprice * getRandom(-0.1, 0)).toFixed(
      2
    );
  }
  return parseFloat(currentprice.toFixed(2));
}

function getRandom(min, max, initialprice, currentprice, offset) {
  max =
    max +
    (initialprice - currentprice > 0
      ? (initialprice * 1.001 - currentprice) / offset
      : 0); // optimized by testing average
  return Math.random() * (max - min) + min;
}

router.post("/", async (req, res) => {
  try {
    const fruitdata = await updatePrice();
    newDate = newDate + 1;
    res.status(200).json({ fruitdata, updatedDate: newDate });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update FruitData: " + error.message });
  }
});

module.exports = router;
