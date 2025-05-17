import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

function TransactionRecord() {
  const [ListOfTransaction, setListOfTransaction] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts/transaction")
      .then((response) => {
        setListOfTransaction(response.data);
        console.log(ListOfTransaction);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  }, []);
  return (
    <div className="transaction-record">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fruit</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Date of Transaction</th>
          </tr>
        </thead>
        <tbody>
          {ListOfTransaction.map((transaction, key) => {
            return (
              <tr key={key}>
                <td>{transaction.id}</td>
                <td>{transaction.fruitname}</td>
                <td>{transaction.amount}</td>
                <td>{parseFloat(transaction.price).toFixed(2)}</td>
                <td>
                  {(parseFloat(transaction.price) * transaction.amount).toFixed(
                    2
                  )}
                </td>
                <td>{transaction.DateofTsc}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionRecord;
