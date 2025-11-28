CREATE TABLE `User` (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    email VARCHAR(150),
    fullName VARCHAR(150)
);

CREATE TABLE Guest (
    guestID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    phoneNumber VARCHAR(50),
    address VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES `User`(userID)
);

CREATE TABLE DynamicPricing (
    pricingID INT AUTO_INCREMENT PRIMARY KEY,
    roomTypeID INT,
    startDate DATE,
    endDate DATE,
    pricingMultiplier DECIMAL(5,2),
    seasonName VARCHAR(100),
    FOREIGN KEY (roomTypeID) REFERENCES RoomType(typeID)
);

CREATE TABLE ServiceItem (
    itemID INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(150),
    category VARCHAR(100),
    unitPrice DECIMAL(10,2),
    availability VARCHAR(50)
);

CREATE TABLE ServiceOrder (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT,
    orderDate DATE,
    status VARCHAR(50),
    totalCost DECIMAL(10,2),
    FOREIGN KEY (reservationID) REFERENCES Reservation(reservationID)
);

