// create and manage database

const FruitData = (sequelize, DataTypes) => {
  const FruitData = sequelize.define(
    "FruitData",
    {
      fruitname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      initialprice: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      currentprice: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      RISK: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
      },
    },
    {
      tableName: "FruitData",
      timestamps: false,
    }
  );
  return FruitData;
};

const User = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      currentmoney: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5000,
      },
      pw: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user",
      timestamps: false,
    }
  );
  return User;
};

const TransactionRecord = (sequelize, DataTypes) => {
  const TransactionRecord = sequelize.define(
    "TransactionRecord",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fruitname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(3),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      DateofTsc: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "transactionRecord",
      timestamps: false,
    }
  );
  return TransactionRecord;
};

const Warehouse = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define(
    "Warehouse",
    {
      fruitname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true, // Composite key with fruitname
      },
      amount: {
        type: DataTypes.DECIMAL(3, 0), // Adjusted to match SQL DECIMAL(3)
        allowNull: true,
      },
    },
    {
      tableName: "warehouse",
      timestamps: false,
    }
  );
  return Warehouse;
};

// Associations and Initialization
module.exports = (sequelize, DataTypes) => {
  const FruitDataModel = FruitData(sequelize, DataTypes);
  const UserModel = User(sequelize, DataTypes);
  const TransactionRecordModel = TransactionRecord(sequelize, DataTypes);
  const WarehouseModel = Warehouse(sequelize, DataTypes);

  // Define associations
  TransactionRecordModel.belongsTo(FruitDataModel, { foreignKey: "fruitname" });
  WarehouseModel.belongsTo(FruitDataModel, { foreignKey: "fruitname" });

  return {
    FruitData: FruitDataModel,
    User: UserModel,
    TransactionRecord: TransactionRecordModel,
    Warehouse: WarehouseModel,
  };
};

// Data initialization
const initializeData = async (sequelize) => {
  const { FruitData, Warehouse, TransactionRecord } = sequelize.models;

  const fruitData = [
    { fruitname: "apple", initialprice: 5.0, currentprice: 5.0, RISK: "low" },
    { fruitname: "banana", initialprice: 4.0, currentprice: 4.0, RISK: "low" },
    { fruitname: "orange", initialprice: 6.0, currentprice: 6.0, RISK: "low" },
    {
      fruitname: "grape",
      initialprice: 10.0,
      currentprice: 10.0,
      RISK: "medium",
    },
    {
      fruitname: "watermelon",
      initialprice: 30.0,
      currentprice: 30.0,
      RISK: "medium",
    },
    {
      fruitname: "strawberry",
      initialprice: 2.0,
      currentprice: 2.0,
      RISK: "medium",
    },
    {
      fruitname: "blueberry",
      initialprice: 15.0,
      currentprice: 15.0,
      RISK: "high",
    },
    { fruitname: "kiwi", initialprice: 8.0, currentprice: 8.0, RISK: "high" },
    { fruitname: "mango", initialprice: 6.0, currentprice: 6.0, RISK: "high" },
  ];

  const warehouseData = fruitData.map(({ fruitname }) => ({
    fruitname,
    amount: 0,
  }));

  // Use transaction for atomicity
  await sequelize.transaction(async (t) => {
    await TransactionRecord.destroy({ where: {}, transaction: t });
    await Warehouse.destroy({ where: {}, transaction: t });
    await FruitData.destroy({ where: {}, transaction: t });

    await FruitData.bulkCreate(fruitData, { transaction: t });
    await Warehouse.bulkCreate(warehouseData, { transaction: t });
  });
};

const syncDatabase = async (sequelize) => {
  try {
    // Sync all models with { force: true } to drop and recreate tables
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.");
    // Initialize data after syncing
    await initializeData(sequelize);
    console.log("Initial data inserted successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

module.exports.initializeData = initializeData;
module.exports.syncDatabase = syncDatabase;
