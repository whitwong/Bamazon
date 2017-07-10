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

// Display current state of database using cli-table module and call function to interact with the user
connection.query("SELECT * FROM products", function(err, res){
	// Table display setup
	var table = new Table({
		head: ["Item ID", "Product", "Department", "Price"],
		colWidths: [10, 20, 15, 10]
	});
	// Add data from database to each table row
	for (var i=0; i<res.length; i++){
		table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })]);
	}
	// Print table to the console
	console.log(table.toString());
	console.log("=============================================================");
	// Call function with user interaction. Calling it here is to help handle asynchronous flow.
	customerTransaction();
});

// Function that prompts customer questions
function customerTransaction(){
	// This connection.query is to access length of response to create validation condition
	connection.query("SELECT * FROM products", function(err, res){
		inquirer.prompt([
			{
				type: "input",
				name: "item",
				message: "What is the ID number of the item you would like to buy?",
				validate: function(value){
					if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) > 0 && parseInt(value) <= res.length){
						return true;
					}
					return false;
				}
			},
			{
				type: "input",
				name: "quantity",
				message: "How many items would you like to buy?",
				validate: function(value){
					if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) > 0){
						return true;
					}
					return false;
				}
			}
		]).then(function(purchase){
			// Read the database
			connection.query("SELECT * FROM products WHERE item_id = ?", [purchase.item], function(err, res){
				// Error handling
				if (err) throw err;

				// Find request item's stock quantity and check that there is enough in-stock
				// If there are enough in stock then reduce the quantity and add revenue to product sales
				if ((res[0].stock_quantity-parseInt(purchase.quantity)) >= 0){
					connection.query("UPDATE products SET ? WHERE ?", 
						[{
							stock_quantity: res[0].stock_quantity - parseInt(purchase.quantity), 
							product_sales: res[0].product_sales + (res[0].price*parseInt(purchase.quantity))
						},
						{
							item_id: purchase.item
						}], invoice());
				}
				else{
					console.log("Insufficient quantity! Cannot process order.");
					console.log("You want to order " + purchase.quantity + ", but we only have " + res[0].stock_quantity + " in stock.");
					console.log("=============================================================");
					askAgain();
				}

				// Function to print total order cost
				function invoice(){
					connection.query("SELECT * FROM products WHERE item_id = ?", [purchase.item],function(err, res){
						console.log("The total cost of your purchase today is " 
							+ (res[0].price*parseInt(purchase.quantity)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
						console.log("=============================================================");
					askAgain();
					});
				}
			});
		});
	})
}

// Function that asks customer if there is another task he/she wants to do
function askAgain(){
	inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: "Would you like to buy another item?",
			default: false
		}
	]).then(function(again){
		if (again.confirm){
			customerTransaction();
		}
		else{
			console.log("Your shopping is complete!");
			// Exits node program execution
			process.exit();
		}
	});
}