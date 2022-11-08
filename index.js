const inquirer = require("inquirer")
const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "",
    database: "employee_trackerDB"
  });

  connection.connect(function(err) {
    if (err) throw err
    console.log("Connected" + connection.threadId)
    startPrompt();
});

function startPrompt() {
  inquirer.prompt([
  {
  type: "list",
  message: "What would you like to do?",
  name: "choice",
  choices: [
            "View All Employees?", 
            "View All Employee's By Roles?",
            "View all Emplyees By Deparments", 
            "Update Employee",
            "Add Employee?",
            "Add Role?",
            "Add Department?"
          ]
  }