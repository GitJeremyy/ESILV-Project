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


// Start server
app.listen(port, () => {
    console.log(`Backend server started on http://localhost:${port}`);
});
