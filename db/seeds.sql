INSERT INTO department (department_name)
VALUES ("Information_Science"), ("Anthropology"), ("Graduate_Studies"), ("Economics"), ("Civil_Engineering"), ("Mechanical_Engineering"),("Biology");


INSERT INTO role_table (title, salary, department_id)
VALUE ("Head of Security", 2000.00, 2), ("Scientist", 30000.00, 3), ("Engineer", 70000.00, 4), ("Admin", 24000.00, 1), ("CEO", 12000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("solomon", "jeo", 1, 3), ("guben", "berhe", 1, 1), ("abel", "zemo", 3, 2), ("yared", "teka", 5, 2), ("robel", "nahom", 5, 2);