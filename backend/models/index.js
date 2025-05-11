// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const modelExport = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Handle object with multiple models (e.g., from data.js)
    if (typeof modelExport === 'object' && modelExport !== null) {
      Object.keys(modelExport).forEach(modelName => {
        if (modelExport[modelName]) {
          db[modelName] = modelExport[modelName];
        }
      });
    } else if (modelExport && modelExport.name) {
      // Handle single model exports
      db[modelExport.name] = modelExport;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("Loaded models:", Object.keys(db));

module.exports = db;