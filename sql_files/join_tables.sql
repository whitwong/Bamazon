-- Sum up revenue in products table --
SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS sum_product_sales, SUM(products.product_sales) - departments.over_head_costs AS total_profit
FROM products
INNER JOIN departments
ON departments.department_name = products.department_name
GROUP BY departments.department_name
ORDER BY departments.department_id;

SELECT * FROM products;

SELECT * FROM departments;