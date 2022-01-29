// Import and requiring express
// const express = require('express');
const artText = require('asciiart-logo');
//Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console-table')
//Require sequelize and the config/connection file for the password
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('./config/connection');


//initial text that appears
const logoText = logo({
    name: 'Employee Tracker',
    lineChars: 10,
    padding: 2,
    margin: 3,     
    borderColor: 'green',
    logoColor: 'green'
}).render();

console.log(logo);


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      //Add MySQL password
      password: 'Jq150010!',
      database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
  );

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
        //choice option for veiw all departments
        if (choice.listChoice === 'view all departments') {
            viewAlldept() 
         //choice option for view all roles
        }else if(choice.listChoice === 'view all roles'){
            viewAllroles()
        //choice option for view all employees
        }else if (choice.listChoice === 'view all employees'){
            viewAllemployees()
        //choice option for add a department
        }else if (choice.listChoice === 'add a department'){
            addDepartment()

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
    })

}
//view all roles function
function viewAllroles(){
db.query('SELECT * FROM ROLE', (err, results) => {
if (err){
    console.log(err);
}else {
    console.table(results);
    menuFunction()
 
}


})

}
//view all employees function
function viewAllemployees(){
db.query('SELECT * FROM EMPLOYEE', (err, results) => {
if (err){
    console.log(err);
}else {
    console.table(results);
    menuFunction()
}
})
}
//add a department function
function addDepartment(){
    inquirer.prompt([
        {
            message: "what department would you like to add?",
            name: "deptADD",
            type: "input",
        }
    ]).then((input)=>{
        console.log(input)
        db.query(`INSERT INTO department (name) VALUES ('${input.deptADD}')`, (err) => {
            if (err){
                console.log(err);
            }else console.log("new department added");
            menuFunction()

        })
        

    })

   
}
//launch the menu
menuFunction()







// //inquirer questions
// inquirer.prompt([
//     {
//         name: 'title',
//         message: "What is the role?",
//         type: 'input'
//     },
//     {
//         name: 'salary',
//         message: 'How much do they make?',
//         type: 'input'
//     },
//     {
//         name: 'department_id',
//         message: 'What department does it belong to?',
//         type: 'list',
//         choices: departments
//     }
// ]).then







