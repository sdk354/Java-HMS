CREATE DATABASE IF NOT EXISTS hoteldb;
USE hoteldb;

CREATE TABLE RoomType (
    typeID INT AUTO_INCREMENT PRIMARY KEY,
    typeName VARCHAR(100),
    basePrice DECIMAL(10,2),
    capacity INT
);

CREATE TABLE Room (
    roomNumber INT PRIMARY KEY,
    roomTypeID INT,
    status VARCHAR(50),
    floorNumber INT,
    mapCoordinates VARCHAR(100),
    FOREIGN KEY (roomTypeID) REFERENCES RoomType(typeID)
);

CREATE TABLE Reservation (
    reservationID INT AUTO_INCREMENT PRIMARY KEY,
    guestID INT,
    roomID INT,
    checkInDate DATE,
    checkOutDate DATE,
    bookingStatus VARCHAR(50),
    totalAmount DECIMAL(10,2),
    FOREIGN KEY (guestID) REFERENCES Guest(guestID),
    FOREIGN KEY (roomID) REFERENCES Room(roomNumber)
);

CREATE TABLE CleaningTask (
    taskID INT AUTO_INCREMENT PRIMARY KEY,
    roomID INT,
    userID INT,
    assignedDate DATE,
    status VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (roomID) REFERENCES Room(roomNumber),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Bill (
    billID INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT,
    generatedDate DATE,
    roomCharges DECIMAL(10,2),
    serviceCharges DECIMAL(10,2),
    taxAmount DECIMAL(10,2),
    grandTotal DECIMAL(10,2),
    FOREIGN KEY (reservationID) REFERENCES Reservation(reservationID)
);
