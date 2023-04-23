DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (

department_id INT NOT NULL AUTO_INCREMENT,

department_name VARCHAR(30) NOT NULL,

PRIMARY KEY(department_id)

);

CREATE TABLE role_table (

role_id INT NOT NULL AUTO_INCREMENT,

title VARCHAR(30) NOT NULL,

salary DECIMAL(10,2) NOT NULL,

PRIMARY KEY (role_id),

department_id INT,

FOREIGN KEY (department_id) REFERENCES department(department_id)

);

CREATE TABLE employee (

employee_id INT NOT NULL AUTO_INCREMENT,

manager_id INT NOT NULL,

first_name VARCHAR(30) NOT NULL,

last_name VARCHAR(30) NOT NULL,

PRIMARY KEY (employee_id),

role_id INT,

FOREIGN KEY (role_id) REFERENCES role_table(role_id)
);