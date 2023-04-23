const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const db = require(".");
const connection = mysql.createConnection({
  host: "localhost",

  // mysql port; if not 3306
  port: 3306,

  // database username
  user: "root",

  // database password
  password: "abelzemo",
  // database name
  database: "employee_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(" Successfully connected to DB! ");
  init();
});

function init() {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "Quit"
      ],
      message: "What would you like to do?",
      name: "option"
    })
    .then(function (result) {

      console.log("You selected: " + result.option);

      switch (result.option) {
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "view all departments":
          viewDepartment();
          break;
        case "view all roles":
          viewRoles();
          break;
        case "view all employees":
          viewEmployees();
          break;
        case "update an employee role":
          updateEmployee();
          break;
        default:
          quit();
      }
    });
}

function viewDepartment() {
  // select from the db
  let view_all_departments = "SELECT * FROM department";
  connection.query(view_all_departments, function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
  // show the result to the user (console.table)
}

function viewRoles() {
  // select from the db
  let view_all_roles = "SELECT * FROM role_table";
  connection.query(view_all_roles, function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
  // show the result to the user (console.table)
}

function viewEmployees() {
  const sql = `SELECT employee.employee_id,
  employee.first_name,
  employee.last_name,
  role_table.title AS job_title,
  department.department_name,
  role_table.salary,
  CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
  FROM employee
  LEFT JOIN role_table ON employee.role_id = role_table.role_id
  LEFT JOIN department ON role_table.department_id = department.department_id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.employee_id
  ORDER By employee.employee_id`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    init();
  });
}

function addDepartment() {

  inquirer.prompt({

    type: "input",
    message: "What is the name of the department?",
    name: "department_name"

  }).then(function (answer) {

    connection.query("INSERT INTO department (department_name) VALUES (?)", [answer.department_name], function (err, res) {
      if (err) throw err;
      console.table(res)
      init()
    })
  })
}

addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the name of the role?",
        name: "role_name"
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "salary"
      }
    ])
    .then(answer => {
      const params = [answer.role_name, answer.salary];

      // grab dept from department table
      const roleSql = `SELECT department_name, department_id FROM department`; 

      connection.query(roleSql, (err, data) => {
        if (err) throw err; 
    
        const dept = data.map(({ department_name, department_id }) => ({ department_name: department_name, value: department_id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: dept
        }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO role_table (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.table(result);
              init();
       });
     });
   });
 });
};

function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What's the first name of the employee?",
          name: "employee_first_name"
        },
        {
          type: "input",
          message: "What's the last name of the employee?",
          name: "employee_last_name"
        },
        {
          type: "input",
          message: "What is the manager id number?",
          name: "manager_ID"
        }
      ])
      .then(answer => {
        const params = [answer.employee_first_name, answer.employee_last_name, answer.manager_ID];
  
        // grab role id from role table
        const roleSql = `SELECT role_id, department_id FROM role_table`;
  
        connection.query(roleSql, (err, data) => {
          if (err) throw err;
  
          const role = data.map(({ role_id, department_id }) => ({ role_id: role_id, value: department_id }));
  
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the role id?",
              choices: role
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);
              const sql = `INSERT INTO employee (first_name, last_name, manager_id,role_id)
              VALUES (?, ?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.table(result);
                init();
              });
            });
        });
      });
  }

function updateEmployee() {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ employee_id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: employee_id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const select_role = `SELECT * FROM role_table`;

        connection.query(select_role, (err, data) => {
          if (err) throw err; 

          const roles_to_be_assigned = data.map(({ role_id, title }) => ({ name: title, value: role_id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'chooseRole',
                message: "Assign employee's new role",
                choices: roles_to_be_assigned
              }
            ])
                .then(choose_role => {
                const role = choose_role.chooseRole;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 
                const sql = `UPDATE employee SET role_id = ? WHERE employee_id = ?`;

                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                init();
          });
        });
      });
    });
  });
};

function quit() {
  connection.end();
  process.exit();
}
