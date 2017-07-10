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

// Function that prompts for supervisor options
function supervisorOptions(){
	inquirer.prompt([
		{
			type: "list",
			name: "department",
			message: "Supervisor Options",
			choices: ["View Product Sales by Department", "Create New Department"]
		}
	]).then(function(sales){
		var lookup = {
			// Function that displays department overhead and total profits information. Uses MySQL 'JOIN' command and aliases.
			"View Product Sales by Department": function(){
				// Display database information using cli-table module
				connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
					+ "SUM(products.product_sales) AS sum_product_sales, "
					+ "SUM(products.product_sales) - departments.over_head_costs AS total_profit "
					+ "FROM products INNER JOIN departments " 
					+ "ON departments.department_name = products.department_name "
					+ "GROUP BY departments.department_name "
					+ "ORDER BY departments.department_id", function(err, res){
					// Table display setup
					var table = new Table({
						head: ["Department ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
						colWidths: [15, 17, 15, 15, 15]
					});
					// Add data from database to each table row
					for (var i=0; i<res.length; i++){
						table.push([res[i].department_id, res[i].department_name, 
							res[i].over_head_costs.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
							res[i].sum_product_sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
							res[i].total_profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })]);
					}
					// Print table to the console
					console.log(table.toString());
					askAgain();
				});
			},
			// Function that allows supervisor to add a new department to the database
			"Create New Department": function(){
				inquirer.prompt([
					{
						type: "input",
						name: "name",
						message: "What is the name of the new department?",
						validate: function(value){
							if (value !== ""){
								return true;
							}
							return false;
						}
					},
					{
						type: "input",
						name: "overhead",
						message: "How much is the overhead of the new department?",
						validate: function(value){
							if (isNaN(value) === false && typeof(parseInt(value)) === "number" && parseInt(value) >= 0){
								return true;
							}
							return false;
						}
					}
				]).then(function(department){
					connection.query("INSERT INTO departments SET ?",
						{
							department_name: department.name,
							over_head_costs: department.overhead
						}, function(err, res){
							console.log("You successfully added '" + department.name + "' as a new department!");
							askAgain();
						});
				})
			}
		}
		lookup[sales.department]();
	});
}

// Function that asks supervisor if there is another task he/she wants to do
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
			supervisorOptions();
		}
		else{
			console.log("All tasks are done.");
			// Exits node program execution
			process.exit();
		}
	});
}

// Initial function call
supervisorOptions();