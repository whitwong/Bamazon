CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("headphones", "electronics", 15.50, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("life jacket", "sports", 29.99, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("playdoh", "toys", 5, 250);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("puzzle", "toys", 5, 500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Borderlands", "electronics", 35, 15);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("tennis racket", "sports", 12.99, 30);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("yoga mat", "sports", 10, 240);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Legos", "toys", 25, 550);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("TV", "electronics", 649.89, 120);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Twister", "toys", 18, 150);

SELECT * FROM products;