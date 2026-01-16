-- Password for each user is 'password123'

CREATE
DATABASE IF NOT EXISTS hoteldb;
USE
hoteldb;

CREATE TABLE RoomType
(
    typeID    INT AUTO_INCREMENT PRIMARY KEY,
    typeName  VARCHAR(100),
    basePrice DECIMAL(10, 2),
    capacity  INT
);

CREATE TABLE Users
(
    userID       INT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(100) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role         VARCHAR(50),
    email        VARCHAR(150),
    fullName     VARCHAR(150),
    enabled      BOOLEAN DEFAULT TRUE
);

CREATE TABLE Guest
(
    guestID     INT AUTO_INCREMENT PRIMARY KEY,
    userID      INT,
    phoneNumber VARCHAR(50),
    address     VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE Room
(
    roomNumber     INT PRIMARY KEY,
    roomTypeID     INT,
    status         VARCHAR(50),
    floorNumber    INT,
    mapCoordinates VARCHAR(100),
    FOREIGN KEY (roomTypeID) REFERENCES RoomType (typeID)
);

CREATE TABLE Reservation
(
    reservationID INT AUTO_INCREMENT PRIMARY KEY,
    guestID       INT,
    roomID        INT,
    checkInDate   DATE,
    checkOutDate  DATE,
    bookingStatus VARCHAR(50),
    totalAmount   DECIMAL(10, 2),
    FOREIGN KEY (guestID) REFERENCES Guest (guestID),
    FOREIGN KEY (roomID) REFERENCES Room (roomNumber)
);

CREATE TABLE CleaningTask
(
    taskID       INT AUTO_INCREMENT PRIMARY KEY,
    roomID       INT,
    userID       INT,
    assignedDate DATE,
    status       VARCHAR(50),
    notes        TEXT,
    FOREIGN KEY (roomID) REFERENCES Room (roomNumber),
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE Bill
(
    billID         INT AUTO_INCREMENT PRIMARY KEY,
    reservationID  INT,
    generatedDate  DATE,
    roomCharges    DECIMAL(10, 2),
    serviceCharges DECIMAL(10, 2),
    taxAmount      DECIMAL(10, 2),
    grandTotal     DECIMAL(10, 2),
    paymentMethod  VARCHAR(50),
    paymentStatus  VARCHAR(50),
    FOREIGN KEY (reservationID) REFERENCES Reservation (reservationID)
);

CREATE TABLE DynamicPricing
(
    pricingID         INT AUTO_INCREMENT PRIMARY KEY,
    roomTypeID        INT,
    startDate         DATE,
    endDate           DATE,
    pricingMultiplier DECIMAL(5, 2),
    seasonName        VARCHAR(100),
    FOREIGN KEY (roomTypeID) REFERENCES RoomType (typeID)
);

CREATE TABLE ServiceItem
(
    itemID       INT AUTO_INCREMENT PRIMARY KEY,
    itemName     VARCHAR(150),
    category     VARCHAR(100),
    unitPrice    DECIMAL(10, 2),
    availability VARCHAR(50)
);

CREATE TABLE ServiceOrder
(
    orderID       INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT,
    orderDate     DATETIME(6),
    status        VARCHAR(50),
    totalCost     DECIMAL(10, 2),
    FOREIGN KEY (reservationID) REFERENCES Reservation (reservationID)
);

INSERT INTO RoomType (typeName, basePrice, capacity)
VALUES ('Single', 5000, 1),
       ('Double', 8000, 2),
       ('Deluxe', 12000, 3),
       ('Suite', 20000, 4);

INSERT INTO DynamicPricing (roomTypeID, startDate, endDate, pricingMultiplier, seasonName)
VALUES (1, '2025-12-01', '2025-12-31', 1.50, 'Christmas Season'),
       (2, '2025-12-01', '2025-12-31', 1.50, 'Christmas Season'),
       (3, '2025-06-01', '2025-08-31', 1.25, 'Summer Peak'),
       (4, '2025-06-01', '2025-08-31', 1.25, 'Summer Peak');

INSERT INTO Users (username, passwordHash, role, email, fullName)
VALUES ('john_doe', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest', 'jdoe@example.com',
        'John Doe'),
       ('thomas_brown', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest', 'tbrown@example.com',
        'Thomas Brown'),
       ('sarah_connor', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest', 'sconnor@example.com',
        'Sarah Connor'),
       ('robert_miller', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'housekeeping',
        'rmiller@example.com', 'Robert Miller'),
       ('jane_smith', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'housekeeping',
        'jsmith@example.com', 'Jane Smith'),
       ('michael_white', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'manager',
        'mwhite@example.com', 'Michael White'),
       ('emily_davis', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'manager', 'edavis@example.com',
        'Emily Davis'),
       ('henry_moore', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'admin', 'hmoore@example.com',
        'Henry Moore'),
       ('jeffrey_hawking', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'admin',
        'jhawking@example.com', 'Jeffrey Hawking'),
       ('david_wilson', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest', 'dwilson@example.com',
        'David Wilson'),
       ('james_anderson', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest',
        'janderson@example.com', 'James Anderson'),
       ('olivia_martinez', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest',
        'omartinez@example.com', 'Olivia Martinez'),
       ('william_garcia', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest',
        'wgarcia@example.com', 'William Garcia'),
       ('robert_johnson', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'guest',
        'rjohnson@example.com', 'Robert Johnson'),
       ('susan_lee', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'housekeeping', 'slee@hotel.com',
        'Susan Lee'),
       ('richard_brown', '$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q', 'manager', 'rbrown@hotel.com',
        'Richard Brown');

INSERT INTO Guest (userID, phoneNumber, address, dateOfBirth)
VALUES (1, '+12125550101', '4521 Maplewood Drive, Springfield, IL 62704', '1990-05-15'),
       (2, '+12065550199', '892 Oak Avenue, Seattle, WA 98109', '1985-09-30'),
       (3, '+13105550145', '1205 Sunset Boulevard, Los Angeles, CA 90026', '1988-11-20'),
       (10, '+17135550178', '3042 Westheimer Road, Houston, TX 77056', '1980-02-19'),
       (11, '+12125550182', '1938 Sullivan Place, Brooklyn, NY 11225', '1978-06-18'),
       (12, '+12025550133', '2021 K Street NW, Washington, DC 20006', '1984-03-22'),
       (13, '+17185550167', '72-14 Austin Street, Forest Hills, NY 11375', '2001-08-10'),
       (14, '+13125550122', '500 South Buena Vista Street, Burbank, CA 91521', '1970-05-29');

INSERT INTO Room (roomNumber, roomTypeID, status, floorNumber, mapCoordinates)
VALUES (101, 1, 'Available', 1, '1-1'),
       (102, 1, 'Available', 1, '1-2'),
       (103, 1, 'Available', 1, '1-3'),
       (104, 1, 'Available', 1, '1-4'),
       (105, 1, 'Available', 1, '1-5'),
       (106, 1, 'Available', 1, '1-6'),
       (107, 1, 'Available', 1, '1-7'),
       (108, 1, 'Available', 1, '1-8'),
       (109, 1, 'Available', 1, '1-9'),
       (110, 1, 'Available', 1, '1-10'),
       (201, 2, 'Available', 2, '2-1'),
       (202, 2, 'Booked', 2, '2-2'),
       (203, 2, 'Available', 2, '2-3'),
       (204, 2, 'Available', 2, '2-4'),
       (205, 2, 'Available', 2, '2-5'),
       (206, 2, 'Available', 2, '2-6'),
       (207, 2, 'Available', 2, '2-7'),
       (208, 2, 'Available', 2, '2-8'),
       (209, 2, 'Available', 2, '2-9'),
       (210, 2, 'Available', 2, '2-10'),
       (301, 3, 'Available', 3, '3-1'),
       (302, 3, 'Maintenance', 3, '3-2'),
       (303, 3, 'Available', 3, '3-3'),
       (304, 3, 'Available', 3, '3-4'),
       (305, 3, 'Available', 3, '3-5'),
       (306, 3, 'Available', 3, '3-6'),
       (307, 3, 'Available', 3, '3-7'),
       (308, 3, 'Available', 3, '3-8'),
       (309, 3, 'Available', 3, '3-9'),
       (310, 3, 'Available', 3, '3-10'),
       (401, 4, 'Booked', 4, '4-1'),
       (402, 4, 'Available', 4, '4-2'),
       (403, 4, 'Available', 4, '4-3'),
       (404, 4, 'Available', 4, '4-4'),
       (405, 4, 'Available', 4, '4-5'),
       (406, 4, 'Available', 4, '4-6'),
       (407, 4, 'Available', 4, '4-7'),
       (408, 4, 'Available', 4, '4-8'),
       (409, 4, 'Available', 4, '4-9'),
       (410, 4, 'Available', 4, '4-10');

INSERT INTO CleaningTask (roomID, userID, assignedDate, status, notes)
VALUES (101, 4, '2025-01-12', 'Completed', 'Standard clean'),
       (202, 5, '2025-01-13', 'In Progress', 'Deep clean requested'),
       (302, 15, '2025-01-14', 'Pending', 'AC Repair follow-up'),
       (401, 4, '2025-01-14', 'Pending', 'Turn down service'),
       (210, 5, '2025-01-15', 'Completed', 'Ready for check-in');

INSERT INTO Reservation (guestID, roomID, checkInDate, checkOutDate, bookingStatus, totalAmount)
VALUES (1, 101, '2025-01-10', '2025-01-12', 'Confirmed', 10000.00),
       (2, 202, '2025-01-15', '2025-01-18', 'Confirmed', 24000.00),
       (4, 401, '2025-01-20', '2025-01-22', 'Confirmed', 40000.00);

INSERT INTO Bill (reservationID, generatedDate, roomCharges, serviceCharges, taxAmount, grandTotal, paymentMethod,
                  paymentStatus)
VALUES (1, '2025-01-12', 10000.00, 1500.00, 1150.00, 12650.00, 'CASH', 'COMPLETED'),
       (2, '2025-01-18', 24000.00, 5000.00, 2900.00, 31900.00, 'CARD', 'COMPLETED');

INSERT INTO ServiceItem (itemName, category, unitPrice, availability)
VALUES ('Breakfast', 'Food', 25.00, 'Available'),
       ('Airport Pickup', 'Transport', 50.00, 'Available'),
       ('Spa Session', 'Wellness', 80.00, 'OutOfStock');

INSERT INTO ServiceOrder (reservationID, orderDate, status, totalCost)
VALUES (1, '2025-01-11', 'Completed', 45.00),
       (2, '2025-01-16', 'Pending', 50.00);