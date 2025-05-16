import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


//sell fruit in warehouse
function Warehouse() {
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
  const [listOfPosts, setListOfPosts] = useState([]);
  const [soldItems, setSoldItems] = useState([]); // Store sold items for POST
  const [amounts, setAmounts] = useState({}); // Track amount to sell for each fruit

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts/warehouse")
      .then((response) => {
        setwarehouse(response.data);
      })
      .catch((response) => {
        console.log("error , no data");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts/fruitdata")
      .then((response) => {
        setListOfPosts(response.data);
      })
      .catch((response) => {
        console.log("error , no data");
      });
  }, []);

     // Add to soldItems with negative amount
    // setSoldItems((prev) => {
    //   const existing = prev.find((item) => item.fruitname === fruitname);
    //   if (existing) {
    //     return prev.map((item) =>
    //       item.fruitname === fruitname
    //         ? { ...item, amount: item.amount - amount }
    //         : item
    //     );
    //   }
    //   return [...prev, { fruitname, amount: -amount }];
    // });


  const handleIncrement = (fruitname)=>{};

  const handleDecrement = (fruitname)=>{};

  // Handle sell all
  const handleSellAll = async () => {
    // Build sold items from amounts
    const itemsToSell = Object.entries(amounts)
      .filter(([_, amount]) => amount > 0)
      .map(([fruitname, amount]) => ({
        fruitname,
        amount: -amount, // Negative for sales
      }));

    if (itemsToSell.length === 0) {
      alert("No items to sell.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/posts/warehouse", itemsToSell);
      console.log("Sale successful:", response.data);
      // Update warehouse state with response
      setwarehouse(response.data.updates);
      // Reset amounts
      setAmounts((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {})
      );
      // Clear sold items
      setSoldItems([]);
      alert("Sale submitted successfully!");
    } catch (error) {
      console.error("Error submitting sale:", error);
      alert("Failed to submit sale.");
    }
  };    

  return (
    <div className="warehouse">
      {listOfPosts.map((value,key)=>{
        return (<Card className="fruit-card" key={key}>
              <Card.Img
                variant="top"
                src={
                  fruitImages[value.fruitname.toLowerCase()] ||
                  "/assets/images/default.svg"
                }
                alt={value.fruitname}
                className="fruit-image"
              />
              <Card.Body className="fruit-card-body">
                <Card.Title className="fruit-title">
                  {value.fruitname}
                </Card.Title>

              </Card.Body>
              <div className="counter-container">
                  <Button
                    variant="primary"
                    className="addorMinusbtn"
                    onClick={() => handleDecrement(value.fruitname)}
                  >
                    +
                  </Button>
                  <span className="counter-display">
                    {} 
                  </span>
                  <Button
                    variant="primary"
                    className="addorMinusbtn"
                    onClick={() => handleIncrement(value.fruitname)}
                  >
                    -
                  </Button>
                </div>
            </Card>)
      })}
      <div className="mt-4 text-center">
        <Button
          variant="success"
          className="px-4 py-2"
          onClick={handleSellAll}
        >
          Sell All
        </Button>
      </div>
    </div>
    
  );
}

export default Warehouse