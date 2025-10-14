-- BCrypt hashed password is: password123
INSERT INTO users (id, first_name, last_name, email, password) VALUES
    (1, 'John', 'Phobos', 'phobos@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO'),
    (2, 'Sarah', 'Moon', 'moon@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO'),
    (3, 'Michael', 'Deimos', 'deimos@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO'),
    (4, 'Emily', 'Europa', 'europa@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');

INSERT INTO employees (id, position) VALUES
    (1, 'Sales Manager'),
    (2, 'Sales Associate'),
    (3, 'Security Officer'),
    (4, 'Security Supervisor');
