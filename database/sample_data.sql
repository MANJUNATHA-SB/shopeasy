-- ============================================================
-- Sample data. Run after schema.sql
-- Test logins:
--   admin@shop.com / Admin@123  (ADMIN)
--   user@shop.com  / User@123   (USER)
-- ============================================================

USE ecommerce_db;

-- Users (passwords are BCrypt hashes)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@shop.com', '$2a$10$UMB88zgHgjEIuh.Ji.5bOeKdn3WIF8aadFoI2xJEUUU6vOhD4fNWa', 'ADMIN'),
('Test User', 'user@shop.com', '$2a$10$H42/YpnW5YkHppqICDhQWOAAmXN5Bggwt0jbI83tB12IQ1k0EqzbW', 'USER');

-- Carts (one per user)
INSERT INTO carts (user_id) VALUES (1), (2);

-- Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Phones, headphones, and gadgets'),
('Books', 'Programming and general reading'),
('Clothing', 'Everyday wear'),
('Home & Kitchen', 'Useful things for your home'),
('Sports', 'Fitness and outdoor gear');

-- Products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
('Wireless Earbuds', 'Bluetooth 5.3 earbuds with charging case and 20 hours of battery life.', 1999.00, 50, 'https://picsum.photos/seed/earbuds/400/300', 1),
('Bluetooth Speaker', 'Portable waterproof speaker with deep bass.', 2499.00, 30, 'https://picsum.photos/seed/speaker/400/300', 1),
('Power Bank 10000mAh', 'Slim fast-charging power bank with dual USB output.', 1299.00, 80, 'https://picsum.photos/seed/powerbank/400/300', 1),
('Clean Code', 'A handbook of agile software craftsmanship.', 599.00, 40, 'https://picsum.photos/seed/cleancode/400/300', 2),
('Effective Java', 'Best practices for writing better Java code.', 749.00, 25, 'https://picsum.photos/seed/effectivejava/400/300', 2),
('Atomic Habits', 'Build good habits and break bad ones.', 399.00, 60, 'https://picsum.photos/seed/atomichabits/400/300', 2),
('Cotton T-Shirt', 'Soft, breathable round-neck t-shirt.', 499.00, 100, 'https://picsum.photos/seed/tshirt/400/300', 3),
('Denim Jacket', 'Classic fit denim jacket for all seasons.', 1899.00, 20, 'https://picsum.photos/seed/jacket/400/300', 3),
('Non-stick Frying Pan', '24 cm frying pan with a heat-resistant handle.', 799.00, 45, 'https://picsum.photos/seed/fryingpan/400/300', 4),
('Steel Water Bottle', '1 litre insulated bottle, keeps drinks cold for 24 hours.', 449.00, 90, 'https://picsum.photos/seed/bottle/400/300', 4),
('Yoga Mat', '6 mm anti-slip yoga mat with carry strap.', 699.00, 35, 'https://picsum.photos/seed/yogamat/400/300', 5),
('Badminton Racket Set', 'Set of 2 rackets with 3 shuttlecocks and a cover.', 999.00, 0, 'https://picsum.photos/seed/racket/400/300', 5);
