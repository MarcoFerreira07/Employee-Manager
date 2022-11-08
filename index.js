const mysql = require('mysql2/promise');
let inquirer = require("inquirer")

let connection

initialize()
main();

//connects VS code to MySql
async function initialize() {
    connection = await mysql.createConnection({
       host: 'localhost', 
       user: 'root',
        database: 'TheOffice_db',
         password: "" 
      })

}

//this prompt initiates all 8 options there are to choose from
async function main() {
    // get the client
    // create the connection
        const responseObject = await inquirer.prompt([{
            //Remember to add a welcome message
            type: 'list',
            name: 'starterQuestion',
            message: "Hello, what would you like to do?",
            choices: ["view all departments",
                      "view all roles",
                      "view all employees",
                      "add a department",
                      "add a role",
                      "add an employee",
                      "update an employee role",
                      "quit"]
        }])

        // console.log(responseObject)

        //these 8 if statesments direct the user to the code that actually does what they want
        // for example the first initializes line 96 and displays the department table
        if (responseObject.starterQuestion === "view all departments"){
            viewAllDepartments()
        }
        if (responseObject.starterQuestion === "view all roles"){
            viewAllRoles()
        }
        if (responseObject.starterQuestion === "view all employees"){
            viewAllEmployees()
        }
        if (responseObject.starterQuestion === "add a department"){
       
        }
        if (responseObject.starterQuestion === "add a role"){
            addRole()
        
        }
        if (responseObject.starterQuestion === "add an employee"){
            addEmployee()
    
        }
        if (responseObject.starterQuestion === "update an employee role"){
            updateRole()
     
        }
        if (responseObject.starterQuestion === "nada"){
            endingMessage()
           
        }
       
    }

        async function viewAllDepartments(){
            const [rows] = await connection.execute(`SELECT * FROM department;`)
            console.log("Departments")
            console.table(rows)
            main()
        }

        async function viewAllRoles(){
            const [rows] = await connection.execute(`SELECT role.id, 
            role.title, 
            role.salary, 
            department.name 
            AS department
            FROM role
            INNER JOIN department ON role.department_id = department.id;`)
            console.table(rows)
            main()
        }

        async function viewAllEmployees(){
            // const [rows] = await connection.execute(`SELECT * FROM employees;`)
            const [rows] = await connection.execute(`SELECT employees.id, 
            employees.first_name, 
            employees.last_name, 
            role.title, 
            department.name AS department,
            role.salary, 
            CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employees
            LEFT JOIN role ON employees.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employees manager ON employees.manager_id = manager.id;`)
            console.log("table with all the employees")
            console.table(rows)
            main()
        }

        async function addDepartment(){
            let userInput = await inquirer.prompt([{
                type: 'input',
                name: 'addDepartment',
                message: "What department would you like to add",
            }])
            // let deptSQL = insert into department (name) values("marketing");SELECT * FROM department;
            let deptSQL = await connection.execute(`insert into department (name) values(?);`, [userInput.addDepartment])
            let [viewDept] = await connection.execute(`select * from department`)
            console.log(deptSQL)
            console.table(viewDept)
            main()
        }

            //This prompt allows users to input information for the new role
        async function addRole(){
            let userInput = await inquirer.prompt([{
                type: 'input',
                name: 'roleTitle',
                message: "add a Title",
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: "Salary?",

            },
            {
                type: 'input',
                name: 'departmentID',
                message: "Department ID?",
            },
        ])
         let roleSQL = await connection.execute(`insert into role (title, salary, department_id) values(?, ?, ?);`, [userInput.roleJob, userInput.roleSalary, userInput.departmentID])
         let [viewAllRoles] = await connection.execute(`select * from role`)
            console.log(roleSQL)
            console.table(viewAllRoles)
            main()
        }

        //this block of code does the same as the previous one but for employees
        async function addEmployee(){
            let userInput = await inquirer.prompt([{
                type: 'input',
                name: 'employeeFirstName',
                message: "First name of new employee",
            }, 
            {
                type: 'input',
                name: 'employeeLastName',
                message: "Last name of new employee",
            },
            {
                type: 'input',
                name: 'employeeRoleId',
                message: "what is the employees role ID?",
            },
            {
                type: 'input',
                name: 'managerID',
                message: "what is the managers ID",
            },

        ])
        let employeeSQL = await connection.execute(`insert into employees (first_name, last_name, role_id, manager_id) values(?, ?, ?, ?);`, [userInput.employeeFirstName, userInput.employeeLastName, userInput.employeeRoleId, userInput.managerID])
        let [viewAllEmployees] = await connection.execute(`select * from employees`)
        console.log(employeeSQL)
        console.table(viewAllEmployees)
       main()
        }
        // this block of code allows user to change information that's already in the database
        async function updateRole(){
            const [employees] = await connection.execute(`SELECT first_name as name, id as value FROM employees;`)
            const [role] = await connection.execute(`SELECT id as value, title as name FROM role;`)
            // console.log( role, employees )
            
                let userInput = await inquirer.prompt([{
                    type: 'list',
                    name: 'updateEmployee',
                    message: "What employee would you like to update",
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'updateRole',
                    message: "What would you like their new role to be",
                    choices: role
                }
            ])
            const [updatedRole] = await connection.execute(`UPDATE employees SET role_id = ? WHERE id = ?;`,[userInput.updateRole, userInput.updateEmployee])
            let [viewAllEmployees] = await connection.execute(`SELECT employees.id, 
            employees.first_name, 
            employees.last_name, 
            role.title, 
            department.name AS department,
            role.salary, 
            CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employees
            LEFT JOIN role ON employees.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employees manager ON employees.manager_id = manager.id;`)
            console.log(updatedRole)
            console.table(viewAllEmployees)
            main()
        }

        //this funcion ends the application
        async function endingMessage(){
            console.log("Thank you have a great day")
        }
