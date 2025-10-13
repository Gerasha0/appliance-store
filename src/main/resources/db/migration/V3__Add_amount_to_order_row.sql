-- Add amount column to order_row table
ALTER TABLE order_row ADD COLUMN amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

