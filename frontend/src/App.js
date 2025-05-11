import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import TRecord from "./pages/TransactionRecord";
import Login from "./pages/login";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navbar">
        <Link to="/"> Home Page</Link>
        <Link to="/transactionrecord">Transaction Record</Link>
        <Link to="/login">Login</Link> 
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactionrecord" element={<TRecord />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;