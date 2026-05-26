CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Demo Users
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@test.com', 'password123', 'admin'),
('Manager User', 'manager@test.com', 'password123', 'manager'),
('Staff User', 'staff@test.com', 'password123', 'staff');



CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    source VARCHAR(50),
    branch VARCHAR(100),
    staff VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New',
    value DECIMAL(10, 2),
    notes TEXT,
    follow_up_date DATETIME NULL,
    follow_up_reason VARCHAR(255) NULL,
    follow_up_note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert dummy data
INSERT INTO staff (name, role, dept, branch, status, email, phone) VALUES 
('John Doe', 'Manager', 'Operations', 'New York', 'Active', 'john@company.com', '+1 555-0101'),
('Jane Smith', 'Senior Dev', 'Engineering', 'London', 'On Leave', 'jane@company.com', '+44 20 7946 0958');

-- 1. Add missing profile columns to your existing users table
ALTER TABLE users ADD COLUMN dept VARCHAR(100) DEFAULT 'General';
ALTER TABLE users ADD COLUMN branch VARCHAR(100) DEFAULT 'Headquarters';
ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE users ADD COLUMN phone VARCHAR(50);

-- 2. (Optional) You can now delete the old staff table if it exists
DROP TABLE IF EXISTS staff;



CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    manager_id INT NULL,  -- Connects to users table
    capacity INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    color VARCHAR(100) DEFAULT 'from-indigo-500 to-blue-600',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Optional: Insert dummy data
INSERT INTO branches (name, location, capacity) VALUES 
('Headquarters', 'New York, USA', 100),
('Europe Hub', 'London, UK', 50);


-- Add Follow-up columns to existing leads table
ALTER TABLE leads 
ADD COLUMN follow_up_date DATETIME NULL,
ADD COLUMN follow_up_reason VARCHAR(255) NULL,
ADD COLUMN follow_up_note TEXT NULL;