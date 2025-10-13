-- BCrypt hashed password for: password123
-- Hash: $2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO

-- Manufacturers (10 records)
INSERT INTO manufacturer (id, name, address, country) VALUES (1, 'Samsung', '129 Samsung-ro, Suwon', 'South Korea');
INSERT INTO manufacturer (id, name, address, country) VALUES (2, 'Dell', 'One Dell Way, Round Rock, TX', 'USA');
INSERT INTO manufacturer (id, name, address, country) VALUES (3, 'HP', '1501 Page Mill Road, Palo Alto, CA', 'USA');
INSERT INTO manufacturer (id, name, address, country) VALUES (4, 'Apple', 'One Apple Park Way, Cupertino, CA', 'USA');
INSERT INTO manufacturer (id, name, address, country) VALUES (5, 'Lenovo', '1009 Think Place, Morrisville, NC', 'USA');
INSERT INTO manufacturer (id, name, address, country) VALUES (6, 'Acer', '88 Xihhu Rd., Xizhi, New Taipei City', 'Taiwan');
INSERT INTO manufacturer (id, name, address, country) VALUES (7, 'AMD', '2485 Augustine Drive, Santa Clara, CA', 'USA');
INSERT INTO manufacturer (id, name, address, country) VALUES (8, 'LG', '20 Yeouido-dong, Seoul', 'South Korea');
INSERT INTO manufacturer (id, name, address, country) VALUES (9, 'Sony', '1-7-1 Konan, Minato-ku, Tokyo', 'Japan');
INSERT INTO manufacturer (id, name, address, country) VALUES (10, 'Intel', '2200 Mission College Blvd, Santa Clara, CA', 'USA');

-- Users (Employees) - 10 records
INSERT INTO users (id, first_name, last_name, email, password) VALUES (1, 'John', 'Phobos', 'phobos@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (2, 'Sarah', 'Moon', 'moon@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (3, 'Michael', 'Deimos', 'deimos@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (4, 'Emily', 'Europa', 'europa@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (13, 'Thomas', 'Titan', 'titan@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (14, 'Jennifer', 'Io', 'io@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (15, 'Christopher', 'Callisto', 'callisto@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (16, 'Jessica', 'Ganymede', 'ganymede@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (17, 'Daniel', 'Triton', 'triton@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (18, 'Amanda', 'Rhea', 'rhea@epam.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');

INSERT INTO employees (id, position) VALUES (1, 'Sales Manager');
INSERT INTO employees (id, position) VALUES (2, 'Sales Associate');
INSERT INTO employees (id, position) VALUES (3, 'Security Officer');
INSERT INTO employees (id, position) VALUES (4, 'Security Supervisor');
INSERT INTO employees (id, position) VALUES (13, 'Store Manager');
INSERT INTO employees (id, position) VALUES (14, 'Customer Service Representative');
INSERT INTO employees (id, position) VALUES (15, 'Technical Support Specialist');
INSERT INTO employees (id, position) VALUES (16, 'Inventory Manager');
INSERT INTO employees (id, position) VALUES (17, 'Marketing Coordinator');
INSERT INTO employees (id, position) VALUES (18, 'Operations Manager');

-- Users (Clients) - 10 records
INSERT INTO users (id, first_name, last_name, email, password) VALUES (5, 'James', 'Mercury', 'mercury@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (6, 'Maria', 'Venus', 'venus@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (7, 'Robert', 'Earth', 'earth@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (8, 'Patricia', 'Mars', 'mars@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (9, 'Michael', 'Jupiter', 'jupiter@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (10, 'Linda', 'Saturn', 'saturn@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (11, 'David', 'Uranus', 'uranus@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (12, 'Barbara', 'Neptune', 'neptune@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (19, 'William', 'Pluto', 'pluto@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');
INSERT INTO users (id, first_name, last_name, email, password) VALUES (20, 'Elizabeth', 'Ceres', 'ceres@client.com','$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO');

INSERT INTO clients (id, phone, address, card) VALUES (5, '+1-555-0001', '101 Mercury Street, NY', '1000-0000-0000-0001');
INSERT INTO clients (id, phone, address, card) VALUES (6, '+1-555-0002', '202 Venus Avenue, CA', '1000-0000-0000-0002');
INSERT INTO clients (id, phone, address, card) VALUES (7, '+1-555-0003', '303 Earth Boulevard, TX', '1000-0000-0000-0003');
INSERT INTO clients (id, phone, address, card) VALUES (8, '+1-555-0004', '404 Mars Road, FL', '1000-0000-0000-0004');
INSERT INTO clients (id, phone, address, card) VALUES (9, '+1-555-0005', '505 Jupiter Lane, IL', '1000-0000-0000-0005');
INSERT INTO clients (id, phone, address, card) VALUES (10, '+1-555-0006', '606 Saturn Drive, WA', '1000-0000-0000-0006');
INSERT INTO clients (id, phone, address, card) VALUES (11, '+1-555-0007', '707 Uranus Court, MA', '1000-0000-0000-0007');
INSERT INTO clients (id, phone, address, card) VALUES (12, '+1-555-0008', '808 Neptune Way, CO', '1000-0000-0000-0008');
INSERT INTO clients (id, phone, address, card) VALUES (19, '+1-555-0009', '909 Pluto Plaza, AZ', '1000-0000-0000-0009');
INSERT INTO clients (id, phone, address, card) VALUES (20, '+1-555-0010', '1010 Ceres Street, NV', '1000-0000-0000-0010');

-- Appliances (10 records)
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Claw', 'BIG', 'Model-A',1,'ACCUMULATOR','High capacity','Powerful appliance',600, 1299.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Bane', 'SMALL', 'Model-B',3,'AC110','Compact design','Efficient device',2200, 899.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Ecu', 'SMALL', 'Model-C',2,'ACCUMULATOR','Portable','Easy to use',800, 599.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Kang Dae', 'BIG', 'Model-D',4,'AC220','Professional grade','Industrial strength',3600, 2499.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Gust', 'BIG', 'Model-E',5,'ACCUMULATOR','Reliable','Long lasting',650, 1099.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Ancile', 'SMALL', 'Model-F',6,'AC220','Energy efficient','Eco-friendly',230, 399.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Halo', 'BIG', 'Model-G',7,'ACCUMULATOR','Modern design','Smart features',300, 1599.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Thunder', 'BIG', 'Model-H',8,'AC220','Heavy duty','Industrial power',4000, 2799.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Whisper', 'SMALL', 'Model-I',9,'ACCUMULATOR','Ultra quiet','Silent operation',150, 449.99);
INSERT INTO appliance (name, category, model, manufacturer_id, power_type, characteristic, description, power, price) VALUES ('Velocity', 'SMALL', 'Model-J',10,'AC110','High speed','Fast processing',1800, 749.99);

-- Reset auto-increment values to start after manual inserts
ALTER TABLE manufacturer AUTO_INCREMENT = 100;
ALTER TABLE users AUTO_INCREMENT = 100;
ALTER TABLE appliance AUTO_INCREMENT = 100;

