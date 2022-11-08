const mysql = require('mysql2/promise');
let inquirer = require("inquirer");


let connection;

// start();
initialize();
main();


async function initialize() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeetracker_db'
  })
}

function start() {
//   console.log(`
//   $$$$$$$$\                         $$\                                               
//   $$  _____|                        $$ |                                              
//   $$ |      $$$$$$\$$$$\   $$$$$$\  $$ | $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$\        
//   $$$$$\    $$  _$$  _$$\ $$  __$$\ $$ |$$  __$$\ $$ |  $$ |$$  __$$\ $$  __$$\       
//   $$  __|   $$ / $$ / $$ |$$ /  $$ |$$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |$$$$$$$$ |      
//   $$ |      $$ | $$ | $$ |$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |$$   ____|$$   ____|      
//   $$$$$$$$\ $$ | $$ | $$ |$$$$$$$  |$$ |\$$$$$$  |\$$$$$$$ |\$$$$$$$\ \$$$$$$$\       
//   \________|\__| \__| \__|$$  ____/ \__| \______/  \____$$ | \_______| \_______|      
//                           $$ |                    $$\   $$ |                          
//                           $$ |                    \$$$$$$  |                          
//                           \__|                     \______/                           
//   $$\      $$\                                                                        
//   $$$\    $$$ |                                                                       
//   $$$$\  $$$$ | $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\             
//   $$\$$\$$ $$ | \____$$\ $$  __$$\  \____$$\ $$  __$$\ $$  __$$\ $$  __$$\            
//   $$ \$$$  $$ | $$$$$$$ |$$ |  $$ | $$$$$$$ |$$ /  $$ |$$$$$$$$ |$$ |  \__|           
//   $$ |\$  /$$ |$$  __$$ |$$ |  $$ |$$  __$$ |$$ |  $$ |$$   ____|$$ |                 
//   $$ | \_/ $$ |\$$$$$$$ |$$ |  $$ |\$$$$$$$ |\$$$$$$$ |\$$$$$$$\ $$ |                 
//   \__|     \__| \_______|\__|  \__| \_______| \____$$ | \_______|\__|                 
//                                              $$\   $$ |                               
//                                              \$$$$$$  |                               
//                                               \______/                                `)
}
async function main() {
  
  try {
    const menuQuestion =  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menuOptions',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update employee role', "I'm finished"]
  }
   let answers = await inquirer.prompt(menuQuestion)
    switch (answers.menuOptions) {
    case 'view all departments':
      viewDepartments()
      break;
    case 'view all roles':
      viewRoles()
      break;
    case 'view all employees':
      viewEmployees()
      break;
    case 'add a department':
      addDepartment()
      break;
    case 'add a role':
      addRole()
      break;
    case 'add an employee':
      addEmployee()
      break;
    case 'update employee role':
      updateRole()
      break;
    default:
      process.exit()
      break;
  }
console.log(answers)
  } catch (error) {
    console.log(error)
  }
  
 
}


async function viewDepartments() {
  
  const [departments] = await connection.execute(`SELECT * FROM department`);
  console.table(departments);
  await main()
}

async function viewRoles() {
  const [roles] = await connection.execute(`SELECT roles.id, roles.title, roles.salary, department.names as "Department" FROM employeetracker_db.roles INNER JOIN department  on department.id = roles.department_id;`);
  console.table(roles);
  await main()
}

async function viewEmployees() {
  const [employees] = await connection.execute(`SELECT A.id, A.firstName AS "First Name", A.lastName AS "Last Name", roles.title, department.names AS "Department", roles.salary, B.firstName AS "Manager" FROM employees A INNER JOIN roles  on roles.id = A.role_id INNER JOIN department  on department.id = roles.department_id left join employees B on A.manager_id = B.id `);
  console.table(employees);
  await main()
}

async function addDepartment(){
  const addDepartments = [{
    type: 'input',
    message: 'Name of the department you want to add?',
    name: 'departmentName'
  }]
  const departmentAnswer = await inquirer.prompt(addDepartments)
  
  const newDepartment = departmentAnswer.departmentName
  
  await connection.execute(`INSERT INTO department(names) VALUES ('${newDepartment}');`)

  console.log(`${newDepartment} department added!`)
  
  main()
}

async function addRole(){
  try {
    
    const [departments] = await connection.execute(`SELECT * FROM department;`)
  
    const addRoles = [{
      type: 'input',
      message: 'Name of the role you want to add?',
      name: 'roleName'
    },
    {
      type: 'input',
      message: 'Total salary for the new role?',
      name: 'roleSalary'
    },
    {
      type: 'list',
      message: 'Which department does this role belong to?',
      name: 'roleDepartment',
      choices: departments.map(department => ({
        name:department.names, value:department.id
      }))
    },
    ]

    const addRoleAnswers = await inquirer.prompt(addRoles)
    
    const roleName = addRoleAnswers.roleName
    const roleSalary = addRoleAnswers.roleSalary
    const roleDepartment = addRoleAnswers.roleDepartment
  
    
    await connection.execute(`INSERT INTO roles(title, salary, department_id) VALUES (?,?,?);`, [roleName,roleSalary,roleDepartment])

    console.log(`${roleName} role added!`)
  
    main()
  } catch (error) {
    console.log(error)
  }
}


async function addEmployee(){


  try {
    const [roles] = await connection.execute(`SELECT * FROM roles;`)
    const [employees] = await connection.execute(`SELECT * FROM employees;`)

    
    const addEmployees = [{
      type: 'input',
      message: 'First name of the employee you want to add?',
      name: 'empFirstName'
    },
  {
    type: 'input',
    message: 'Last name of the employee you want to add?',
    name: 'empLastName'
  },
  {
      type: 'list',
    message: 'What is the employees role?',
    name: 'empRole',
    choices: roles.map(role => ({
      name:role.title, value:role.id}))
  },
  {
    type: 'list',
    message: 'Who is the employees manager?',
    name: 'empManager',
    choices: employees.map(employee => ({
      name: (employee.firstName + " " + employee.lastName), value:employee.id}))
  }
]
  const addEmpAnswers = await inquirer.prompt(addEmployees)
  
  const empFirstName = addEmpAnswers.empFirstName
  const empLastName = addEmpAnswers.empLastName
  const empRole = addEmpAnswers.empRole
  const empManager = addEmpAnswers.empManager
  
  await connection.execute(`INSERT INTO employees(firstName, lastName, role_id, manager_id) VALUES (?,?,?,?);`, [empFirstName,empLastName,empRole,empManager])

  console.log(`${empFirstName} ${empLastName} role added!`)
  main()
} catch (error) {
  console.log(error)
}
}

async function updateRole(){
  try {
    const [roles] = await connection.execute(`SELECT * FROM roles;`)
    const [employees] = await connection.execute(`SELECT * FROM employees;`)

    
    const updateRoles = [{
      type: 'list',
      message: 'Which employee would you like to update?',
      name: 'employeeEdit',
      choices: employees.map(employee => ({
        name: (employee.firstName + " " + employee.lastName), value:employee.id}))
    },
    {
      type: 'list',
      message: 'What is their new role?',
      name: 'newRole',
      choices: roles.map(role => ({
        name:role.title, value:role.id}))
    }]

    const roleUpdateAnswers = await inquirer.prompt(updateRoles)
  
    
    const employeeEdit = roleUpdateAnswers.employeeEdit
    const newRole = roleUpdateAnswers.newRole
   
    
    await connection.execute(`UPDATE employees SET role_id = (?) WHERE id=(?) ;`, [newRole,employeeEdit])
  
    console.log(`Role updated!`)

    main()
  } catch (error) {
    console.log(error)
  }
}
let {prompt} = require("inquirer");
// const db = require("./db");
// require("console.table");
// const logo = require("asciiart-logo");


// init();
function init() {
  // const logoText = logo({ name: "Employee Tracker" }).render();
  // console.log(logoText);
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "view all employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER",
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE",
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add Role",
          value: "ADD_ROLE",
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE",
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT",
        },
        {
          name: "View Total Utilized Budget By Department",
          value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT",
        },

        {
          name: "quit",
          value: "QUIT",
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "REMOVE_EMPLOYEE":
        removeEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager();
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "REMOVE_DEPARTMENT":
        removeDepartment();
        break;
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
        viewUtilizedBudgetByDepartment();
        break;
      case "VIEW_ROLES":
        viewRoles();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "REMOVE_ROLE":
        removeRole();
        break;

      default:
        quit();
    }
  });
}
function viewEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("/n");
      console.table(employees);
    })
    .then(() => loadMainPrompts(quit));
}

function addRole() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        name: "title",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => loadMainPrompts());
    });
  });
}

function removeRole() {
  db.findAllRoles().then(([rows]) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "roleId",
        message:
          "Which role do you want to remove? (Warning: This will also remove employees)",
        choices: roleChoices,
      },
    ])
      .then((res) => db.removeRole(res.roleId))
      .then(() => console.log("Removed role from the database"))
      .then(() => loadMainPrompts());
  });
}

function viewDepartments() {
  db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
//department
function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]).then((res) => {
    let name = res;
    db.createDepartment(name)
      .then(() => console.log(`Added ${name.name} to the database`))
      .then(() => loadMainPrompts());
  });
}
// Remove a department
function removeDepartment() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt({
      type: "list",
      name: "departmentId",
      message:
        "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
      choices: departmentChoices,
    })
      .then((res) => db.removeDepartment(res.departmentId))
      .then(() => console.log(`Removed department from the database`))
      .then(() => loadMainPrompts());
  });
}
// View all departments and show their total utilized department budget
function viewUtilizedBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
// Add an employee
function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(([rows]) => {
          let employees = rows;
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`)
            )
            .then(() => loadMainPrompts());
        });
      });
    });
  });
}

function quit() {
  console.log("goodbye");
  process.exit();
}