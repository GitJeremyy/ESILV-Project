const express = require('express');
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret';
const { initialize } = require('./db');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint for login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required.' });
    }

    const connection = await initialize();

    try {
        console.log('Executing query with username:', username);

        // Query to get the user details
        const query = `
            SELECT u.user_id, u.user_password
            FROM Users u
            WHERE u.username = :username
        `;
        const result = await connection.execute(query, [username], { outFormat: oracledb.OUT_FORMAT_OBJECT });


        // If no user is found with the given username
        if (result.rows.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password.' });
        }

        const user = result.rows[0];

        // Check if the password exists in the database (ensure it's not null or empty)
        if (!user.USER_PASSWORD) {
            return res.status(500).send({ message: 'Password not found for the user.' });
        }

        // Directly compare the password from the request to the password in the database
        if (password.trim() === user.USER_PASSWORD.trim()) {
            // Generate JWT token if the password is correct
            const token = jwt.sign({ userId: user.USER_ID, username }, SECRET_KEY, { expiresIn: '1h' });

            // Send response with the token
            res.json({
                message: 'Login successful',
                token: token
            });
        } else {
            console.log('Invalid password');
            return res.status(401).send({ message: 'Invalid username or password.' });
        }

    } catch (err) {
        console.error('Login error:', err); // Detailed error logging
        res.status(500).send({ message: 'Internal error', error: err.message || err });
    } finally {
        await connection.close();
    }
});

// Endpoint for hotels
app.get('/api/hotels', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT h.hotel_id, h.nameH, h.location, 
                   h.total_bookings
            FROM Hotel h
        `;
        const result = await connection.execute(query);

        const hotels = result.rows.map(row => ({
            hotel_id: row[0],
            nameH: row[1],
            location: row[2],
            total_bookings: row[3]
        }));

        res.json(hotels);
    } catch (err) {
        console.error('Hotel fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for guests
app.get('/api/guests', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT g.guest_id, g.g_name, g.g_email, g.g_phone, 
                   g.repeated_guest, g.previous_cancellations, 
                   g.previous_bookings_not_canceled
            FROM Guest g
        `;
        const result = await connection.execute(query);

        const guests = result.rows.map(row => ({
            guest_id: row[0],
            g_name: row[1],
            g_email: row[2],
            g_phone: row[3],
            repeated_guest: row[4] === 'Y',
            previous_cancellations: row[5],
            previous_bookings_not_canceled: row[6]
        }));

        res.json(guests);
    } catch (err) {
        console.error('Guest fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for rooms
app.get('/api/rooms', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT r.room_id, r.hotel_id, r.room_type, r.price
            FROM Room r
        `;
        const result = await connection.execute(query);

        const rooms = result.rows.map(row => ({
            room_id: row[0],
            hotel_id: row[1],
            room_type: row[2],
            price: parseFloat(row[3]) // Convertir en nombre flottant
        }));

        res.json(rooms);
    } catch (err) {
        console.error('Room fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for staff
app.get('/api/staff', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT s.staff_id, s.hotel_id, s.name, s.position, 
                   s.contact_info
            FROM Staff s
        `;
        const result = await connection.execute(query);

        const staff = result.rows.map(row => ({
            staff_id: row[0],
            hotel_id: row[1],
            name: row[2],
            position: row[3],
            contact_info: row[4]
        }));

        res.json(staff);
    } catch (err) {
        console.error('Staff fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for boookings
app.get('/api/bookings', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT b.booking_id, b.guest_id, b.hotel_id, b.room_id, 
                   b.no_of_adults, b.no_of_children, b.meal_plan, 
                   b.car_parking_space, b.lead_time, b.booking_status, 
                   b.booking_date, b.no_of_nights
            FROM Booking b
        `;
        const result = await connection.execute(query);

        const bookings = result.rows.map(row => ({
            booking_id: row[0],
            guest_id: row[1],
            hotel_id: row[2],
            room_id: row[3],
            no_of_adults: row[4],
            no_of_children: row[5],
            meal_plan: row[6],
            car_parking_space: row[7],
            lead_time: row[8],
            booking_status: row[9],
            booking_date: row[10],
            no_of_nights: row[11]
        }));

        res.json(bookings);
    } catch (err) {
        console.error('Booking fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint to create a new reservation
app.post('/api/reservation', async (req, res) => {
    const connection = await initialize();
    try {
        const { no_of_adults, no_of_children, meal_plan, car_parking_space, booking_date, no_of_nights, room_type } = req.body;

        if (!no_of_adults || !meal_plan || !booking_date || !no_of_nights || !room_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hotel_id = 1; // 1 only hotel
        const booking_status = "Not_Canceled";
        const lead_time = Math.floor((new Date(booking_date) - new Date()) / (1000 * 60 * 60 * 24)); // Calculate lead time in days

        const formattedBookingDate = new Date(booking_date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
        const bookingEndDate = new Date(new Date(booking_date).getTime() + no_of_nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Get available room to assign
        const availabilityQuery = `
            SELECT room_id 
            FROM Room 
            WHERE room_type = :room_type 
              AND room_id NOT IN (
                SELECT room_id
                FROM Booking
                WHERE booking_status != 'Canceled'
                  AND (
                    (TO_DATE(:booking_date, 'YYYY-MM-DD') BETWEEN booking_date AND booking_date + no_of_nights - 1)
                    OR
                    (TO_DATE(:booking_end_date, 'YYYY-MM-DD') BETWEEN booking_date AND booking_date + no_of_nights - 1)
                    OR
                    (TO_DATE(:booking_date, 'YYYY-MM-DD') <= booking_date AND TO_DATE(:booking_end_date, 'YYYY-MM-DD') >= booking_date)
                  )
              )
        `;
        const availabilityResult = await connection.execute(availabilityQuery, { room_type, booking_date: formattedBookingDate, booking_end_date: bookingEndDate });

        const availableRooms = availabilityResult.rows.map(row => row[0]);
        if (availableRooms.length === 0) {
            return res.status(400).json({ error: 'No rooms available for the selected type and dates.' });
        }

        // Select the room_id
        const room_id = availableRooms[Math.floor(Math.random() * availableRooms.length)];

        // Insert the booking
        const insertQuery = `
            INSERT INTO Booking (hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights)
            VALUES (:hotel_id, :room_id, :no_of_adults, :no_of_children, :meal_plan, :car_parking_space, :lead_time, :booking_status, TO_DATE(:booking_date, 'YYYY-MM-DD'), :no_of_nights)
        `;
        await connection.execute(insertQuery, { hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date: formattedBookingDate, no_of_nights });

        // Commit the transaction
        await connection.commit();

        // Confirmation
        const selectQuery = `
            SELECT booking_id, hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights
            FROM Booking
            WHERE booking_id = (SELECT MAX(booking_id) FROM Booking)
        `;
        const result = await connection.execute(selectQuery);
        const newBooking = result.rows.map(row => ({
            booking_id: row[0],
            hotel_id: row[1],
            room_id: row[2],
            no_of_adults: row[3],
            no_of_children: row[4],
            meal_plan: row[5],
            car_parking_space: row[6],
            lead_time: row[7],
            booking_status: row[8],
            booking_date: row[9],
            no_of_nights: row[10]
        }))[0];

        console.log('New booking created:', newBooking);
        res.json({ success: true, booking: newBooking });
    } catch (err) {
        console.error('Reservation creation error:', err);

        // Rollback the transaction in case of an error
        if (connection) {
            await connection.rollback();
        }

        res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.put('/api/cancelBooking/:id', async (req, res) => {
    console.log('Cancelling booking with ID:', req.params.id);
    const bookingId = req.params.id;

    const connection = await initialize();
    try {
        const updateQuery = `
      UPDATE Booking
      SET booking_status = 'Canceled'
      WHERE booking_id = :booking_id
    `;
        await connection.execute(updateQuery, { booking_id: bookingId });
        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Error cancelling booking' });
    } finally {
        await connection.close();
    }
});

app.put('/api/updateMealPlan/:id', async (req, res) => {
    const bookingId = req.params.id;
    const { meal_plan } = req.body;

    const connection = await initialize();
    try {
        const updateQuery = `
      UPDATE Booking
      SET meal_plan = :meal_plan
      WHERE booking_id = :booking_id
    `;
        await connection.execute(updateQuery, { meal_plan, booking_id: bookingId });
        await connection.commit();
        res.json({ success: true, meal_plan });
    } catch (err) {
        console.error('Error updating meal plan:', err);
        res.status(500).json({ error: 'Error updating meal plan' });
    } finally {
        await connection.close();
    }
});

app.put('/api/updateCarParkingSpace/:id', async (req, res) => {
    const bookingId = req.params.id;
    const { car_parking_space } = req.body;

    const connection = await initialize();
    try {
        const updateQuery = `
      UPDATE Booking
      SET car_parking_space = :car_parking_space
      WHERE booking_id = :booking_id
    `;
        await connection.execute(updateQuery, { car_parking_space, booking_id: bookingId });
        await connection.commit();
        res.json({ success: true, car_parking_space });
    } catch (err) {
        console.error('Error updating car parking space:', err);
        res.status(500).json({ error: 'Error updating car parking space' });
    } finally {
        await connection.close();
    }
});


// Start server
app.listen(port, () => {
    console.log(`Backend server started on http://localhost:${port}`);
});
