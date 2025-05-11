import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/posts/fruitdata").then((response) => {
      setListOfPosts(response.data);
    });
  }, []);
  return (
    <div className="App">
      {listOfPosts.map((value, key) => {
        return (
          <Card>
            <Card.Body>
              <Card.Title>{value.fruitname}</Card.Title>
              <Card.Text>
                <ul>
                  <li>${value.initialprice}</li>
                  <li>${value.currentprice}</li>
                  <li>Risk: {value.RISK}</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}

export default App;
