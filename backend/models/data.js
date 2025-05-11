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
      userid: {
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
        type: DataTypes.CHAR(64),
        allowNull: true,
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
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      fruitname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      DateofTsc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "transactionRecord",
      timestamps: false,
    }
  );

  return TransactionRecord;
};

// Associations
module.exports = (sequelize, DataTypes) => {
  const FruitDataModel = FruitData(sequelize, DataTypes);
  const UserModel = User(sequelize, DataTypes);
  const TransactionRecordModel = TransactionRecord(sequelize, DataTypes);

  // Define associations
  TransactionRecordModel.belongsTo(UserModel, { foreignKey: "userid" });
  TransactionRecordModel.belongsTo(FruitDataModel, { foreignKey: "fruitname" });

  return {
    FruitData: FruitDataModel,
    User: UserModel,
    TransactionRecord: TransactionRecordModel,
  };
};

// Data initialization
const initializeData = async (sequelize) => {
  const { FruitData ,TransactionRecord} = sequelize.models;
  await TransactionRecord.destroy({ where: {} });
  await FruitData.destroy({ where: {} });
  await FruitData.bulkCreate([
    { fruitname: "Apple", initialprice: 5.0, currentprice: 5.0, RISK: "low" },
    { fruitname: "Banana", initialprice: 4.0, currentprice: 4.0, RISK: "low" },
    { fruitname: "Orange", initialprice: 6.0, currentprice: 6.0, RISK: "low" },
    {
      fruitname: "Grape",
      initialprice: 10.0,
      currentprice: 10.0,
      RISK: "medium",
    },
    {
      fruitname: "Watermelon",
      initialprice: 30.0,
      currentprice: 30.0,
      RISK: "medium",
    },
    {
      fruitname: "Strawberry",
      initialprice: 2.0,
      currentprice: 2.0,
      RISK: "medium",
    },
    {
      fruitname: "Blueberry",
      initialprice: 15.0,
      currentprice: 15.0,
      RISK: "high",
    },
    { fruitname: "Kiwi", initialprice: 8.0, currentprice: 8.0, RISK: "high" },
    { fruitname: "Mango", initialprice: 6.0, currentprice: 6.0, RISK: "high" },
  ]);
};
module.exports.initializeData = initializeData;
