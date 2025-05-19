import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

//sell fruit in warehouse
function Warehouse({Money, setMoney}) {
  const fruitImages = {
    apple: "/assets/images/apple.svg",
    banana: "/assets/images/banana.svg",
    orange: "/assets/images/orange.svg",
    grape: "/assets/images/grape.svg",
    watermelon: "/assets/images/watermelon.svg",
    strawberry: "/assets/images/strawberry.svg",
    blueberry: "/assets/images/blueberry.svg",
    kiwi: "/assets/images/kiwi.svg",
    mango: "/assets/images/mango.svg",
  };
  const [warehouse, setwarehouse] = useState([]);
  const [listOfFruit, setlistOfFruit] = useState([]);
  const [soldItems, setSoldItems] = useState([]); // Store sold items for POST
  const [amounts, setAmounts] = useState({}); // Track amount to sell for each fruit
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price

  // get the amount of each fruit in the warehouse
  //get fruit name, price (too calculate the money to sold)
  useEffect(() => {
    axios
      .get("http://localhost:3001/posts/fruitdata")
      .then((response) => {
        setlistOfFruit(response.data);
      })
      .catch((response) => {
        console.log("error , no data");
      });
    axios
      .get("http://localhost:3001/posts/warehouse")
      .then((response) => {
        setwarehouse(response.data);
      })
      .catch((response) => {
        console.log("error , no data");
      });
  }, []);

  // Initialize amounts to sell for each fruit to 0 once fruit data is loaded
  useEffect(() => {
    const initialAmounts = {}; //array of fruit amount
    listOfFruit.forEach((fruit) => {
      // Initialize amount to sell for each fruit to 0
      initialAmounts[fruit.fruitname] = 0;
    });
    setAmounts(initialAmounts);
  }, [listOfFruit]);

  // Calculate total price whenever amounts or listOfFruit changes
  useEffect(() => {
    let calculatedTotal = 0;
    // Iterate through the amounts state
    Object.keys(amounts).forEach((fruitname) => {
      const amountToSell = amounts[fruitname] || 0;
      if (amountToSell > 0) {
        // Find the corresponding fruit data to get the price
        const fruitData = listOfFruit.find((f) => f.fruitname === fruitname);
        if (fruitData && fruitData.currentprice) {
          const price = parseFloat(fruitData.currentprice);
          calculatedTotal += amountToSell * price;
        }
      }
    });
    setTotalPrice(calculatedTotal); // Update the total price state
  }, [amounts, listOfFruit]); // Depends on amounts and listOfFruit

  const handleIncrement = (fruitname) => {
    const stockItem = warehouse.find((f) => f.fruitname === fruitname);
    const availableStock = stockItem ? Number(stockItem.amount) : 0;

    setAmounts((prevAmounts) => {
      const currentAmountToSell = prevAmounts[fruitname] || 0;
      // Only increment if the amount to sell is less than available stock
      if (currentAmountToSell < availableStock) {
        return { ...prevAmounts, [fruitname]: currentAmountToSell + 1 };
      }
      return prevAmounts; //reached maximum
    });
  };

  const handleDecrement = (fruitname) => {
    setAmounts((prevAmounts) => {
      const currentAmountToSell = prevAmounts[fruitname] || 0;
      // Only decrement if the amount to sell is greater than 0
      if (currentAmountToSell > 0) {
        return { ...prevAmounts, [fruitname]: currentAmountToSell - 1 };
      }
      return prevAmounts; // reached 0
    });
  };

  // Handle sell all selected items
  const handleSellAll = async () => {
    const itemsToSell = [];
    let hasItemsToSell = false;

    // Create a new warehouse state by reducing stock for sold items
    const updatedWarehouse = warehouse.map((item) => {
      const amountToSell = amounts[item.fruitname] || 0;
      if (amountToSell > 0) {
        hasItemsToSell = true;
        const fruitData = listOfFruit.find(
          (f) => f.fruitname === item.fruitname
        );
        const price = parseFloat(fruitData.currentprice);

        itemsToSell.push({
          fruitname: item.fruitname,
          amount: amountToSell,
          pricePerItem: price,
        });
        return { ...item, amount: Number(item.amount) - amountToSell };
      }
      return item;
    });

    if (!hasItemsToSell) {
      console.log("No items selected to sell.");
      alert("Please select an amount for at least one fruit to sell.");
      return;
    }

    setSoldItems(itemsToSell);
    setwarehouse(updatedWarehouse); // Update displayed stock

    // Reset amounts to sell for all fruits
    const resetAmounts = {};
    Object.keys(amounts).forEach((fruitname) => {
      resetAmounts[fruitname] = 0;
    });
    setAmounts(resetAmounts);
    setMoney(Money + totalPrice);

    console.log("Items processed for selling (client-side):", itemsToSell);
    alert(`Processed sales for ${itemsToSell.length} fruit.`);
    // TODO: Implement POST request to backend API when ready
    if (itemsToSell.length > 0) {
      try {
        itemsToSell.forEach((item) => {
          item.amount = -item.amount; // set to negative for backend calculation
        });
        const response = await axios.post(
          "http://localhost:3001/posts/warehouse",
          itemsToSell
        );
        console.log("Items sold successfully on backend:", response.data);
      } catch (error) {
        console.error("Error selling items on backend:", error);
        alert(
          "Error occurred while trying to sync with server. Client-side stock updated."
        );
      }
    }
  };

  return (
    <div className="warehouse-container">
      <div className="fruit-container">
        {listOfFruit.map((fruit, key) => {
          const fruitStockItem = warehouse.find(
            (item) => item.fruitname === fruit.fruitname
          );
          const currentStock = fruitStockItem
            ? Number(fruitStockItem.amount)
            : 0;
          const amountToSell = amounts[fruit.fruitname] || 0;

          return (
            <Card className="fruit-card" key={key}>
              <Card.Img
                variant="top"
                src={
                  fruitImages[fruit.fruitname.toLowerCase()] ||
                  "/assets/images/default.svg"
                }
                alt={fruit.fruitname}
                className="fruit-image"
              />
              <Card.Body className="fruit-card-body">
                <Card.Title className="fruit-title">
                  {fruit.fruitname}
                </Card.Title>{" "}
                <Card.Text className="stock-details">
                  Stock: {currentStock}
                </Card.Text>
                <Card.Text className="price-details">
                  Price: $
                  {fruit.currentprice
                    ? parseFloat(fruit.currentprice).toFixed(2)
                    : "N/A"}
                </Card.Text>
              </Card.Body>
              <div className="counter-container">
                <Button
                  variant="primary" // react-bootstrap variant
                  className="addorMinusbtn" // Keep your class for styling
                  onClick={() => handleDecrement(fruit.fruitname)}
                  disabled={amountToSell === 0}
                >
                  -
                </Button>
                <span className="counter-display">{amountToSell}</span>
                <Button
                  variant="primary" // react-bootstrap variant
                  className="addorMinusbtn" // Keep your class for styling
                  onClick={() => handleIncrement(fruit.fruitname)}
                  disabled={amountToSell >= currentStock}
                >
                  +
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="sell-container">
        <Button
          variant="success"
          className="sell-all-btn"
          onClick={handleSellAll}
        >
          Sell Selected Fruits
        </Button>
        <div className="totalamount">
          <h2>Total:${totalPrice.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
}

export default Warehouse;
