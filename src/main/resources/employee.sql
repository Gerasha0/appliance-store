-- BCrypt hashed password is: Test12345!
INSERT INTO users (id, first_name, last_name, email, password) VALUES
    (1, 'John', 'Phobos', 'phobos@epam.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (2, 'Sarah', 'Moon', 'moon@epam.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (3, 'Michael', 'Deimos', 'deimos@epam.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (4, 'Emily', 'Europa', 'europa@epam.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC');

INSERT INTO employees (id, position) VALUES
    (1, 'Sales Manager'),
    (2, 'Sales Associate'),
    (3, 'Security Officer'),
    (4, 'Security Supervisor');
