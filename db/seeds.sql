USE employeeTracker_db

insert  into employee(first_name, last_name, role_id, manager_id) values 

('Diane','Murphy','1','1'),
('Mary','Patterson','2','1'),
('Jeff','Firrelli','3','2'),
('William','Patterson','4','3'),
('Gerard','Bondur','5','4'),
('Anthony','Bow','6','5'),

insert into department(id, name) values
('Administration'),
('RnD'),
('Sales'),
('HR'),
('Customer_Service'),
('Accounting')

insert into role(salary, title, department_id)
(400.00, 'President','1'),
(200.00, 'RnD','2'),
(300.00, 'VP_Sales','3'),
(100.00, 'HR_Rep','4'),
(50.00, 'Customer_Service_Rep','5'),
(200.00, 'Accountant','6')