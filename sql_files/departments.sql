USE bamazon_db;

CREATE TABLE departments(
	department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES("electronics", 5000);

INSERT INTO departments(department_name, over_head_costs)
VALUES("toys", 3000);

INSERT INTO departments(department_name, over_head_costs)
VALUES("sports", 4000);

INSERT INTO departments(department_name, over_head_costs)
VALUES("furniture", 6000);

UPDATE departments SET over_head_costs = 1500 WHERE department_name = "toys";

SELECT * FROM departments;