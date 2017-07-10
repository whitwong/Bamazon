// Require modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Setup connection to sql server
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "SnowFun1",
	database: "bamazon_db"
});

// Make connection to sql server
connection.connect(function(err){
	if (err) throw err;
});

// Function that prompts for manager options
function managerOptions(){
	inquirer.prompt([
		{
			type: "list",
			name: "menu",
			message: "Manager Options",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
	]).then(function(choice){
		switch(choice.menu){
			// Displays all current product information in a table format
			case "View Products for Sale":
				connection.query("SELECT * FROM products", function(err, res){
					var table = new Table({
						head: ["Item ID", "Product", "Price", "Quantity"],
						colWidths: [10, 20, 10, 10]
					});
					for (var i=0; i<res.length; i++){
						table.push([res[i].item_id, res[i].product_name, res[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), res[i].stock_quantity]);
					}
					console.log(table.toString());
					askAgain();
				});
				break;
			// Displays information for products that have low inventory (e.g. quantity < 5)
			case "View Low Inventory":
				connection.query("SELECT * FROM products", function(err, res){
					var table = new Table({
						head: ["Item ID", "Product", "Price", "Quantity"],
						colWidths: [10, 20, 10, 10]
					});
					for (var i=0; i<res.length; i++){
						if (res[i].stock_quantity < 5){
							table.push([res[i].item_id, res[i].product_name, res[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), res[i].stock_quantity]);
						}
					}
					console.log(table.toString());
					askAgain();
				});
				break;
			// Allows manager to add inventory to database stock_quantity
			case "Add to Inventory":
				// This connection.query is to access length of response to create validation condition
				connection.query("SELECT * FROM products", function(err, res){
					inquirer.prompt([
						{
							type: "input",
							name: "item",
							message: "Enter Item ID number of the product that you want to add inventory:",
							validate: function(value){
								if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) > 0 && parseInt(value) <= res.length){
									return true;
								}
								return false;
							}
						},
						{
							type: "input",
							name: "add",
							message: "How many items do you want to add to inventory?",
							validate: function(value){
								if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) > 0){
									return true;
								}
								return false;
							}
						}
					]).then(function(inventory){
						connection.query("SELECT * FROM products WHERE item_id = ?", [inventory.item], function(err, res){
							connection.query("UPDATE products SET ? WHERE ?", 
								[{
									stock_quantity: res[0].stock_quantity + parseInt(inventory.add)
								},
								{
									item_id: inventory.item
								}], function(err, res){
									console.log(inventory.add +" items have been added to Item ID #" + inventory.item);
									askAgain();
								});
						});
					});
				});
				break;
			// Allows manager to add new products to database
			case "Add New Product":
				inquirer.prompt([
					{
						type: "input",
						name: "name",
						message: "Enter product name:",
						validate: function(value){
							if (value !== ""){
								return true;
							}
							return false;
						}
					},
					{
						type: "input",
						name: "department",
						message: "Enter department name:",
						validate: function(value){
							if (value !== ""){
								return true;
							}
							return false;
						}
					},
					{
						type: "input",
						name: "price",
						message: "How much does this item cost?",
						validate: function(value){
							if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) > 0){
								return true;
							}
							return false;
						}
					},
					{
						type: "input",
						name: "stock",
						message: "How many are in-stock?",
						validate: function(value){
							if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) >= 0){
								return true;
							}
							return false;
						}
					}
				]).then(function(product){
					connection.query("INSERT INTO products SET ?", 
						{
							product_name: product.name,
							department_name: product.department,
							price: product.price,
							stock_quantity: product.stock
						}, function(err, res){
							console.log("You successfully added '" + product.name + "' as a new product!");
							askAgain();
						});
				});
				break;
			default:
				console.log("Something is wrong");
		};
	});
}

// Function that asks manager if there is another task he/she wants to do
function askAgain(){
	console.log("=============================================================");
	inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: "Would you like to do another task?",
			default: false
		}
	]).then(function(again){
		if (again.confirm){
			managerOptions();
		}
		else{
			console.log("All tasks are done.");
			// Exits node program execution
			process.exit();
		}
	});
}

// Initial function call
managerOptions();