import "./App.css";
import "./App2.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import TRecord from "./pages/TransactionRecord";
import Login from "./pages/login";
import Warehouse from "./pages/Warehouse";
import Trend from "./pages/trend";
import Register from "./pages/register";
import axios from "axios";

function App() {
  const [dateofTsc, setdateofTsc] = useState(1);
  const [currentFruitData, setcurrentFruitData] = useState([]);
  const [Money, setMoney] = useState(5000);
  const [priceHistory, setPriceHistory] = useState({});
  const [username, setusername] = useState();
  const [IsLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch initial data (fruit data and money)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fruit data
        const fruitResponse = await axios.get(
          "http://localhost:3001/posts/fruitdata"
        );
        setcurrentFruitData(fruitResponse.data);
        const newPriceHistory = {};
        fruitResponse.data.forEach((fruit) => {
          if (fruit.fruitname) {
            newPriceHistory[fruit.fruitname] = [fruit.currentprice || 0];
          }
        });
        setPriceHistory(newPriceHistory);

        // Fetch initial money
        if (username) {
          const moneyResponse = await axios.get(
            "http://localhost:3001/auth/money",
            username
          );
          setMoney(moneyResponse.data.money || 5000);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          alert("Session expired. Please log in again.");
        }
      }
    };
    fetchData();
  }, [IsLoggedIn]);

  const handleNextDay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed to the next day.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/proceed");
      setdateofTsc(response.data.updatedDate);
      setcurrentFruitData(response.data.fruitdata);
      /*log the price in priceHistory, store as array, represent it as graph in the future*/
      setPriceHistory((prevHistory) => {
        const updatedHistory = { ...prevHistory };
        response.data.fruitdata.forEach((fruit) => {
          if (fruit.fruitname && updatedHistory[fruit.fruitname]) {
            updatedHistory[fruit.fruitname] = [
              ...updatedHistory[fruit.fruitname],
              fruit.currentprice,
            ];
          }
        });
        return updatedHistory;
      });
      const currentmoney = {username:username ,money:Money};
      const updatemoney = await axios.post("http://localhost:3001/auth/money",currentmoney);
      alert("Next Day");
      console.log(priceHistory);
    } catch (error) {
      console.error("Error proceeding to next day:", error);
      alert("Failed to proceed to next day. See console for details.");
    }
  };

  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <Link to="/"> Home Page</Link>
          <Link to="/transactionrecord">Transaction Record</Link>
          <Link to="/Warehouse">Warehouse</Link>
          <div className="userid">username: {username||"anomyous"}</div>
          <div className="money-container">$:{Money.toFixed(2)}</div>
          <div className="user">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                dateofTsc={dateofTsc}
                handleNextDay={handleNextDay}
                currentFruitData={currentFruitData}
                Money={Money}
                setMoney={setMoney}
              />
            }
          />
          <Route path="/transactionrecord" element={<TRecord />} />
          <Route
            path="/login"
            element={
              <Login IsLoggedIn={IsLoggedIn} setIsLoggedIn={setIsLoggedIn} setusername={setusername} />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/warehouse"
            element={<Warehouse Money={Money} setMoney={setMoney} />}
          />
          <Route
            path="/fruit/:fruitname"
            element={<Trend priceHistory={priceHistory} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
