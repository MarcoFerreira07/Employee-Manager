DROP DATABASE IF EXISTS TheOffice_db;
CREATE DATABASE TheOffice_db;

use TheOffice_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary decimal NOT NULL,
  department_id Integer
);
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER, 
    manager_id Integer
);
INSERT INTO department (name)
VALUES 
('CEO'),
('Sales'),
('Accounting'),
("HR");

INSERT INTO role (title, salary, department_id)
VALUES
('CEO', 150000, 1),
('Sales Lead',100000,2 ),
('Sales Intern',30000,2 ),
('Accounting', 80000,3),
('HR', 50000,4);



INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Michael', 'Scott', 1, null),
('Dwight', 'Schrute', 2, 1),
('Jim', 'Halpert', 3, 1),
('Pam', 'Halpert', 4, 3),
('Kelly', 'Kapour', 5, 1);

SELECT * FROM TheOffice_db.role;
SELECT * FROM TheOffice_db.employees;
SELECT * FROM TheOffice_db.department;