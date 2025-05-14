const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");
const { initializeData,syncDatabase } = require("./models/data"); // initialize

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const proceed = require("./route/Proceed.js");
app.use("/proceed",proceed);

db.sequelize.sync().then(async () => {
  try {
    // Initialize FruitData table with data
    await initializeData(db.sequelize);
    await syncDatabase(db.sequelize);
    console.log("Database initialized");

    // Start the server
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  } catch (error) {
    console.error("Error initializing data:", error);
  }
});
