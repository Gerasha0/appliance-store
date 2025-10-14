-- BCrypt hashed password is: Test12345!
INSERT INTO users (id, first_name, last_name, email, password) VALUES
    (5, 'Mercury', 'Planet', 'mercury@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (6, 'Venus', 'Star', 'venus@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (7, 'Earth', 'Blue', 'earth@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (8, 'Mars', 'Red', 'mars@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (9, 'Jupiter', 'Giant', 'jupiter@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (10, 'Saturn', 'Ring', 'saturn@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (11, 'Uranus', 'Ice', 'uranus@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'),
    (12, 'Neptune', 'Blue', 'neptune@client.com','$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC');

INSERT INTO clients (id, phone, address, card) VALUES
    (5, '+1234567890', '123 Mercury Street, Solar City', '1234567890123456'),
    (6, '+1234567891', '456 Venus Avenue, Star Town', '2234567890123456'),
    (7, '+1234567892', '789 Earth Road, Blue District', '3234567890123456'),
    (8, '+1234567893', '321 Mars Boulevard, Red City', '4234567890123456'),
    (9, '+1234567894', '654 Jupiter Lane, Gas Town', '5234567890123456'),
    (10, '+1234567895', '987 Saturn Circle, Ring District', '6234567890123456'),
    (11, '+1234567896', '147 Uranus Street, Ice City', '7234567890123456'),
    (12, '+1234567897', '258 Neptune Avenue, Ocean Town', '8234567890123456');
