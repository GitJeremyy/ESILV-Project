const express = require('express');
const path = require('path');
const { initialize } = require('./db'); // Import to connect to db
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());  // This will allow all origins to access API

app.use(express.json());  // Middleware to process JSON requests

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

        // Validation des champs obligatoires
        if (!no_of_adults || !meal_plan || !booking_date || !no_of_nights || !room_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hotel_id = 1; // 1 only hotel
        const booking_status = "Not_Canceled";
        const lead_time = Math.floor((new Date(booking_date) - new Date()) / (1000 * 60 * 60 * 24)); // Calculate lead time in days

        const formattedBookingDate = new Date(booking_date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
        const bookingEndDate = new Date(new Date(booking_date).getTime() + no_of_nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Étape 1: Récupérer un room_id disponible
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

        // Sélectionner un room_id aléatoire parmi les chambres disponibles
        const room_id = availableRooms[Math.floor(Math.random() * availableRooms.length)];

        // Étape 2: Insérer la réservation
        const insertQuery = `
            INSERT INTO Booking (hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights)
            VALUES (:hotel_id, :room_id, :no_of_adults, :no_of_children, :meal_plan, :car_parking_space, :lead_time, :booking_status, TO_DATE(:booking_date, 'YYYY-MM-DD'), :no_of_nights)
        `;
        await connection.execute(insertQuery, { hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date: formattedBookingDate, no_of_nights });

        // Commit the transaction
        await connection.commit();

        // Étape 3: Récupérer la nouvelle réservation pour confirmation
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
