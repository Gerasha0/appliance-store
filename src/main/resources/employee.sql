-- BCrypt hashed password is: password123
INSERT INTO users (id, first_name, last_name, email, password) VALUES
    (1, 'John', 'Phobos', 'phobos@epam.com','$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6'),
    (2, 'Sarah', 'Moon', 'moon@epam.com','$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6'),
    (3, 'Michael', 'Deimos', 'deimos@epam.com','$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6'),
    (4, 'Emily', 'Europa', 'europa@epam.com','$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6');

INSERT INTO employees (id, position) VALUES
    (1, 'Sales Manager'),
    (2, 'Sales Associate'),
    (3, 'Security Officer'),
    (4, 'Security Supervisor');
