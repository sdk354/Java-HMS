USE hoteldb;

INSERT INTO RoomType (typeName, basePrice, capacity)
VALUES 
('Single', 5000, 1),
('Double', 8000, 2),
('Deluxe', 12000, 3),
('Suite', 20000, 4);

INSERT INTO Room (roomNumber, roomTypeID, status, floorNumber, mapCoordinates)
VALUES
(101, 1, 'Available', 1, 'A1'),
(102, 2, 'Available', 1, 'A2'),
(201, 3, 'Booked', 2, 'B1'),
(202, 4, 'Maintenance', 2, 'B2');

INSERT INTO Reservation (guestID, roomID, checkInDate, checkOutDate, bookingStatus, totalAmount)
VALUES
(1, 101, '2025-01-10', '2025-01-12', 'Confirmed', 10000.00),
(2, 102, '2025-01-15', '2025-01-18', 'Pending', 24000.00);

INSERT INTO CleaningTask (roomID, userID, assignedDate, status, notes)
VALUES
(101, 1, '2025-01-12', 'Completed', 'Cleaned after checkout'),
(202, 2, '2025-01-13', 'In Progress', 'Deep cleaning in progress');

INSERT INTO Bill (reservationID, generatedDate, roomCharges, serviceCharges, taxAmount, grandTotal)
VALUES
(1, '2025-01-12', 10000.00, 1500.00, 1150.00, 12650.00),
(2, '2025-01-18', 24000.00, 5000.00, 2900.00, 31900.00);
