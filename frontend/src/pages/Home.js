import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [counts, setCounts] = useState({});

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

  const handleAdd = (fruitname) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [fruitname]: (prevCounts[fruitname] || 0) + 1,
    }));
  };

  const handleMinus = (fruitname) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [fruitname]: Math.max(prevCounts[fruitname] - 1, 0), // Prevent negative counts
    }));
  };

    // Filter fruits with count > 0 and include their currentprice
  const selectedFruits = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([fruitname, count]) => {
      const fruitData = listOfPosts.find(
        (post) => post.fruitname.toLowerCase() === fruitname.toLowerCase()
      );
      return {
        fruitname,
        count,
        amount: fruitData ? (count * fruitData.currentprice).toFixed(2) : 0,
      };
    });

  return (
    <div className="Home">
      <div className="fruit-container">
        {listOfPosts.map((value, key) => {
          return (
            <Card className="fruit-card" key={key}>
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
                <Card.Title className="fruit-title">{value.fruitname}</Card.Title>
                <Card.Text className="fruit-details">
                  <ul>
                    <li>${value.initialprice}</li>
                    <li>${value.currentprice}</li>
                    <li>Risk: {value.RISK}</li>
                  </ul>
                </Card.Text>
                <div className="counter-container">  
                <Button
                  variant="primary"
                  className="addorMinusbtn"
                  onClick={() => handleAdd(value.fruitname)}
                >
                  +
                </Button>
                <span className="counter-display">
                  {counts[value.fruitname] || 0}
                </span>
                <Button
                  variant="primary"
                  className="addorMinusbtn"
                  onClick={() => handleMinus(value.fruitname)}
                >
                  -
                </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
        </div>  
        <div className="selected-fruits">
          <h2 className="selected-fruits-title">Selected Fruits</h2>
          {selectedFruits.length > 0 ? (
            <ul className="selected-fruits-list">
              {selectedFruits.map(({ fruitname, count, amount }) => (
                <li key={fruitname} className="selected-fruit-item">
                  {fruitname}: {count} (Total: ${amount})
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-selection">No fruits selected.</p>
          )}
        
      </div>
    </div>
  );
}

export default Home;
