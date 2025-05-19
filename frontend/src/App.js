import "./App.css";
import "./App2.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import TRecord from "./pages/TransactionRecord";
import Login from "./pages/login";
import Warehouse from "./pages/Warehouse";
import axios from "axios";

function App() {
  const [dateofTsc, setdateofTsc] = useState(1);
  const [currentFruitData, setcurrentFruitData] = useState([]);
  const [Money, setMoney] = useState(5000);
  //fetch initial fruitdata
  useEffect(() => {
    axios
      .get("http://localhost:3001/posts/fruitdata")
      .then((response) => {
        setcurrentFruitData(response.data);
      })
      .catch((error) => {
        console.log("error , no data");
      });
  }, []);

  const handleNextDay = async () => {
    try {
      const response = await axios.post("http://localhost:3001/proceed");
      setdateofTsc(response.data.updatedDate);
      setcurrentFruitData(response.data.fruitdata);
      /*To do: log the price and store in an array of array, represent it as graph in the future*/
      alert("Next Day");
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
          <h3 className="money-container">$:{Money}</h3>
          <Link to="/login">Login</Link>
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
          <Route path="/login" element={<Login />} />
          <Route
            path="/warehouse"
            element={<Warehouse Money={Money} setMoney={setMoney} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
