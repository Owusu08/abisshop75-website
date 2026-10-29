CREATE DATABASE IF NOT EXISTS abisshop_db;
USE abisshop_db;

-- Products Table (Prices in GHS)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_ghs DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    momo_network ENUM('mtn', 'vod', 'atl') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    reference VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Products in Cedis (GHS)
INSERT INTO products (name, description, price_ghs, image_url) VALUES
('Mystic Blossom', 'Luxury floral perfume mist', 450.00, 'images/mystic-blossom.jpg'),
('Diamond Halo', 'Premium shimmering fragrance', 620.00, 'images/diamond-halo.jpg'),
('Sauvage Signature', 'Bold masculine scent', 850.00, 'images/sauvage.jpg'),
('Golden Elixir', 'Rich amber & vanilla extract', 540.00, 'images/golden-elixir.jpg');
