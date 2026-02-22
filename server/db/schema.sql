-- server/db/schema.sql
-- Run once to set up the database:
--   mysql -u root -p < server/db/schema.sql

CREATE DATABASE IF NOT EXISTS avail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;USE avail_db;

-- ─── Admin Sessions ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_sessions (
    sid VARCHAR(191) PRIMARY KEY,
    expires DATETIME DEFAULT NULL,
    data LONGTEXT
);

-- ─── Product Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Products ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    price INT NOT NULL, -- stored in IDR (whole number)
    image_url VARCHAR(255) DEFAULT NULL,
    badge VARCHAR(30) DEFAULT NULL,
    stock INT NOT NULL DEFAULT 100,
    weight INT NOT NULL COMMENT 'in Gram',
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT
);

-- ─── Orders ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    -- UUID
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(80) NOT NULL,
    customer_postal VARCHAR(10) NOT NULL,
    customer_notes TEXT,
    subtotal INT NOT NULL,
    shipping_fee INT NOT NULL DEFAULT 0,
    total INT NOT NULL,
    status ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Order Items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    qty INT NOT NULL,
    line_total INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ─── Provinces ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provinces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- ─── Cities ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    province_id INT,
    name VARCHAR(100),
    FOREIGN KEY (province_id) REFERENCES provinces(id)
);

-- ─── Couriers ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS couriers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20),
    name VARCHAR(100)
);

-- ─── Shipping Rates ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipping_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT,
    courier_id INT,
    price INT,
    etd VARCHAR(50),
    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (courier_id) REFERENCES couriers(id)
);

-- ─── Seed Couriers ──────────────────────────────────────────────────────────
INSERT INTO couriers (code, name) 
VALUES
  ('jne', 'JNE Express'),
  ('jnt', 'J&T Express');

-- ─── Seed Product Categories ──────────────────────────────────────────────────────────
INSERT INTO
    product_categories (name)
VALUES
    ('FC Sanitary Pad'),
    ('Health Food');
    
-- ─── Seed Products ──────────────────────────────────────────────────────────
INSERT INTO
    products (name, description, category_id, price, image_url, stock, weight)
VALUES
    (
        'Day Use (4 BUNGKUS)',
        'Dipakai saat haid siang hari',
        1,
        140000,
        '/uploads/products/DC_Day_Use_4_PACK.png',
        50,
        200
    ),
    (
        'Night Use (4 BUNGKUS)',
        'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        1,
        155000,
        '/uploads/products/FC_Night_Use_4_PACK.png',
        50,
        200
    ),
    (
        'Pantiliner (4 BUNGKUS)',
        'Dipakai sehari-hari saat tidak haid, keputihan, wanita yang sudah menopause',
        1,
        125000,
        '/uploads/products/FC_Pantiliner_4_PACK.png',
        50,
        175
    ),
    (
        'Pantiliner (1 BALL)',
        'Dipakai sehari-hari saat tidak haid, keputihan, wanita yang sudah menopause',
        1,
        310000,
        '/uploads/products/FC_Pantiliner_P10.png',
        50,
        500
    ),
    (
        'Night Use (1 BALL)',
        'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        1,
        310000,
        '/uploads/products/FC_Night_Use_N9.png',
        50,
        500
    ),
    (
        'Day Use (1 BALL)',
        'Dipakai saat haid siang hari',
        1,
        345000,
        '/uploads/products/FC_Day_Use_D10.png',
        50,
        500
    ),
    (
        'Combination (1 BALL)',
        '1 pack berisi kombinasi 3 day use, night use dan pantiliner',
        1,
        312000,
        '/uploads/products/FC_Combination_C9.png',
        50,
        600
    ),
    (
        'Avail A Cafe',
        'Minuman serbuk kopi dengan berbagai kandungan bahan alami yang dapat membantu meningkatkan stamina tubuh dan berkhasia untuk mengatasi masalah gangguan seksual pria',
        2,
        250000,
        '/uploads/products/product-1771487886152-dely3x.png',
        50,
        600
    );