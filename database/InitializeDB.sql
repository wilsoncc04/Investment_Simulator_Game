CREATE TABLE FruitData (
    fruitname VARCHAR(20) NOT NULL PRIMARY KEY,
    initialprice DECIMAL(5, 2) NOT NULL,
    currentprice DECIMAL(5, 2) NOT NULL,
    RISK ENUM('low','medium','high') NOT NULL
);
CREATE TABLE user (
    userid VARCHAR(20) NOT NULL PRIMARY KEY,
    currentmoney DECIMAL(10, 2) NOT NULL DEFAULT 5000,
    pw CHAR(64)
);
CREATE TABLE transactionRecord (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fruitname VARCHAR(20) NOT NULL,
    amount DECIMAL(3),
    price DECIMAL(5, 2) NOT NULL,
    DateofTsc INT,
    FOREIGN KEY (userid) REFERENCES user(userid),
    FOREIGN KEY (fruitname) REFERENCES FruitData(fruitname)

);


INSERT INTO FruitData 
VALUES 
('apple', 5.00, 5.00, 'low'),
('banana', 4.00, 4.00, 'low'),
('orange', 6.00, 6.00, 'low'),
('grape', 10.00, 10.00, 'medium'),
('watermelon', 30.00, 30.00, 'medium'),
('strawberry', 2.00, 2.00, 'medium'),
('blueberry', 15.00, 15.00, 'high'),
('kiwi', 8.00, 8.00, 'high'),
('mango', 6.00, 6.00, 'high');


