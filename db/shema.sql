DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- DEPARTMENT TABLE ----
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);
-- DEPARTMENT TABLE ----
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- EMPLOYEE ROLE TABLE ----
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)

);

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Finance");


-- EMPLOYEE ROLE SEEDS -------
INSERT INTO role (title, salary, department_id)
VALUE ("Regional Manager", 150000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Assistant to the manager", 250000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Customer Service", 120000, 1);


-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Michael", "Scott", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Dwight", "Schrute", 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jim","Halpert",1,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Pam", "Halpert", 1, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Creed", "Creed", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kelly", "Kapour", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Ryan", "DontRemember", 2, 5);

-- SELECTING FOR CREATING 
--TABLES IN OUR SQL WORKBENCH 
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;