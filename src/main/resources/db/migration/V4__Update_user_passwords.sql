-- Update all user passwords from password123 to Test12345!
-- New BCrypt hash for Test12345!: $2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC

UPDATE users SET password = '$2b$10$YdhDd5xk0h1tpVe.h71X6.vEY4hB8RteAg7iFwaeSXQRt1J7VyAlC'
WHERE password = '$2a$10$zgE9xUQ1dsqCYIW9BvdcFuhIZvEMAiCMPhQojJB/K9EFsEjXcKWxO';

