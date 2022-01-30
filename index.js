// Import and requiring express
// const express = require('express');
//Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
//import and require console-table
require('console-table')
//Require sequelize and the config/connection file for the password
// const sequelize = require('./config/connection');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      //Add MySQL password
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
  );
//launch initial menu
function menuFunction() {
    inquirer.prompt([
        {type: 'list',
        message: 'choose one',
        name: 'listChoice',
        choices: ['view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'upgrade an employee role'
        ]
        }

    ]).then ((choice) => {
        console.log(choice);
        //choice option for 'view all departments'
        if (choice.listChoice === 'view all departments') {
            viewAlldept() 
         //choice option for 'view all roles'
        }else if(choice.listChoice === 'view all roles'){
            viewAllroles()
        //choice option for 'view all employees'
        }else if (choice.listChoice === 'view all employees'){
            viewAllemployees()
        //choice option for 'add a department'
        }else if (choice.listChoice === 'add a department'){
            addDepartment()
            //choice option for 'upgrade employee '
        }else if (choice.listChoice === 'add a role'){
           addRole()
        }
        //choice for option for 'add an employee'
        else if (choice.listChoice === 'add an employee'){
            addEmployee()
        }
        //choice for option to 'upgrade an employee'
        else if(choice.listChoice === 'upgrade an employee role'){
            upgradeEmployee()
        }
    } )

}
//view all department function
function viewAlldept() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err){
            console.log(err);
        }else {
            console.table(results);
        }
        menuFunction()
    })}

//view all roles function
function viewAllroles(){
db.query('SELECT * FROM ROLE', (err, results) => {
if (err){
    console.log(err);
}else {
    console.table(results);
    menuFunction()
}})}
//view all employees function
function viewAllemployees(){
db.query('SELECT * FROM EMPLOYEE', (err, results) => {
if (err){
    console.log(err);
}else {
    console.table(results);
    menuFunction()
}})}
//add a department function
function addDepartment(){
    inquirer.prompt([
        {
            message: "what department would you like to add?",
            name: "deptADD",
            type: "input",
        }
    ]).then((input)=>{
        db.query(`INSERT INTO department (name) VALUES ('${input.deptADD}')`, (err) => {
            if (err){
                console.log(err);
            }else console.log("new department added");
            menuFunction()
        })   
    })
}
//getting the departments so that they can be added to the prompt

db.query("SELECT * FROM department", function(error, res) {
allDepartments = res.map(department => ({name: department.name, value: department.id}));
})
//add a role function
function addRole(){
    inquirer.prompt([
        {
        message: "What is the name of the role?",
        name: "roleName",
        type: "input",
        },
        {
        message: "What is the salary of the role?",
        name: "roleSalary",
        type: "input",
        },
        {
        type: "list",
        message: "what is the role's department",
        name: "roleDept",
        choices: allDepartments
        },
    ]).then ((input) =>{
       db.query(`INSERT INTO role (title, salary, department_id) 
       VALUES ('${input.roleName}', ${input.roleSalary}, ${input.roleDept})`, (err) => {
           if (err){
               console.log(err);
           }else console.log("new role added");
           menuFunction()
       })
    })
}


// getting the roles so that they can be added to the prompt
db.query("SELECT * FROM role", function(error, res) {
    allRoles = res.map(role => ({name: role.title, value: role.id}));
    });
    //getting the manager's names by excluding employees without manager_id
db.query("SELECT first_name, last_name, id FROM employee WHERE manager_id IS NOT NULL", function(error, res) {
        managerNames = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
    });

// add an employee function
function addEmployee(){
    inquirer.prompt([
        {
        message: "What is the first name of the employee?",
        name: "empFirst",
        type: "input",
        },
        {
        message: "What is the last name of the employee?",
        name: "empLast",
        type: "input",
        },
        {type: 'list',
        message: "what is the employee's role id?",
        name: "empRole",
        choices: allRoles
        },
        {
            type: "list",
            message: "who is the employee's manager id?",
            name: "empManager",
            choices: managerNames
        },
    ]).then ((input) =>{
        console.log(input)
       db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
       VALUES ("${input.empFirst}", "${input.empLast}", "${input.empRole}", "${input.empManager}")`, (err) => {
           if (err){
               console.log(err);
           }else console.log("new employee added");
           menuFunction()
       })
    })
}
//selects the employees and their values
db.query("SELECT * FROM employee", function(error, res) {
    employeeList = res.map(employs => ({name: employs.first_name + ' ' + employs.last_name, value: employs.id}));
});
//employee upgrade function
function upgradeEmployee(){
    inquirer.prompt([
        {
        message: "Which employee would you like to upgrade?",
        name: "upChoice",
        type: "list",
        choices: employeeList
        },
        {
            type: 'list',
        message: "what role would you like to assign to the employee?",
        name: "upRole",
         choices: allRoles
        },
       
    ]).then ((input) =>{
        var updatedemployee = input.upChoice;
        var updatedRole = input.upRole;
        const allUpdates = `UPDATE employee SET role_id = "${updatedRole}" WHERE id = "${updatedemployee}"`;
        db.query(allUpdates, function (err, res){
            if (err){
                console.log(err);
            }else console.log("Employee Updated!")
            menuFunction()

        })
    })
}




//launch the menu
menuFunction()








