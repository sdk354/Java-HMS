INSERT INTO `User` (username, passwordHash, role, email, fullName) VALUES
('john_doe', 'hashedpassword123', 'guest', 'john@example.com', 'John Doe'),
('jane_smith', 'hashedpassword456', 'guest', 'jane@example.com', 'Jane Smith'),
('admin_user', 'hashedadminpass', 'admin', 'admin@example.com', 'Admin User');

INSERT INTO Guest (userID, phoneNumber, address, dateOfBirth) VALUES
(1, '+1234567890', '123 Main St, Cityville', '1990-05-15'),
(2, '+1987654321', '456 Elm St, Townsville', '1985-09-30');

INSERT INTO DynamicPricing (roomTypeID, startDate, endDate, pricingMultiplier, seasonName) VALUES
(1, '2025-12-01', '2025-12-31', 1.2, 'Holiday Season'),
(2, '2025-06-01', '2025-08-31', 1.5, 'Summer Peak'),
(3, '2025-11-01', '2025-11-30', 1.1, 'Autumn Special');

INSERT INTO ServiceItem (itemName, category, unitPrice, availability) VALUES
('Breakfast', 'Food', 15.00, 'Available'),
('Airport Pickup', 'Transport', 50.00, 'Available'),
('Spa Session', 'Wellness', 80.00, 'OutOfStock');

INSERT INTO ServiceOrder (reservationID, orderDate, status, totalCost) VALUES
(1, '2025-12-21', 'Completed', 45.00),
(2, '2025-06-11', 'Pending', 50.00);
