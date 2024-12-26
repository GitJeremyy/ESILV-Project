import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { getConnection } from './db';
import { PoolClient } from 'pg';

// Configuration
const SECRET_KEY = 'secret';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

interface User {
    user_id: number;
    username: string;
    user_password: string;
}

interface Hotel {
    hotel_id: number;
    nameh: string;
    location: string;
    total_bookings: number;
}

interface Guest {
    guest_id: number;
    g_name: string;
    g_email: string;
    g_phone: string;
    repeated_guest: boolean;
    previous_cancellations: number;
    previous_bookings_not_canceled: number;
}

interface Room {
    room_id: number;
    hotel_id: number;
    room_type: string;
    price: number;
}

interface Staff {
    staff_id: number;
    hotel_id: number;
    name: string;
    position: string;
    contact_info: string;
}

interface Booking {
    booking_id: number;
    guest_id: number;
    hotel_id: number;
    room_id: number;
    no_of_adults: number;
    no_of_children: number;
    meal_plan: string;
    car_parking_space: number;
    lead_time: number;
    booking_status: string;
    booking_date: string;
    no_of_nights: number;
}

// Endpoint for login
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send({ message: 'Username and password are required.' });
        return;
    }

    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT user_id, user_password
            FROM Users
            WHERE username = $1
        `;
        const result = await client.query(query, [username]);

        if (result.rows.length === 0) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }

        const user = result.rows[0];
        if (password.trim() === user.user_password.trim()) {
            const token = jwt.sign({ userId: user.user_id, username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).send({ message: 'Invalid username or password.' });
        }
    } catch (err: any) {
        console.error('Login error:', err);
        res.status(500).send({ message: 'Internal error', error: err.message || err });
    } finally {
        client.release();
    }
});

// Endpoint for hotels
app.get('/api/hotels', async (_req: Request, res: Response) => {
    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT hotel_id, nameh, location, total_bookings
            FROM Hotel
        `;
        const result = await client.query(query);

        const hotels: Hotel[] = result.rows.map(row => ({
            hotel_id: row.hotel_id,
            nameh: row.nameh,
            location: row.location,
            total_bookings: row.total_bookings,
        }));

        res.json(hotels);
    } catch (err: any) {
        console.error('Hotel fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        client.release();
    }
});

// Endpoint for guests
app.get('/api/guests', async (_req: Request, res: Response) => {
    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT guest_id, g_name, g_email, g_phone, repeated_guest, previous_cancellations, previous_bookings_not_canceled
            FROM Guest
        `;
        const result = await client.query(query);

        const guests: Guest[] = result.rows.map(row => ({
            guest_id: row.guest_id,
            g_name: row.g_name,
            g_email: row.g_email,
            g_phone: row.g_phone,
            repeated_guest: row.repeated_guest,
            previous_cancellations: row.previous_cancellations,
            previous_bookings_not_canceled: row.previous_bookings_not_canceled,
        }));

        res.json(guests);
    } catch (err: any) {
        console.error('Guest fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        client.release();
    }
});

// Endpoint for rooms
app.get('/api/rooms', async (_req: Request, res: Response) => {
    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT room_id, hotel_id, room_type, price
            FROM Room
        `;
        const result = await client.query(query);

        const rooms: Room[] = result.rows.map(row => ({
            room_id: row.room_id,
            hotel_id: row.hotel_id,
            room_type: row.room_type,
            price: parseFloat(row.price),
        }));

        res.json(rooms);
    } catch (err: any) {
        console.error('Room fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        client.release();
    }
});

// Endpoint for staff
app.get('/api/staff', async (_req: Request, res: Response) => {
    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT staff_id, hotel_id, name, position, contact_info
            FROM Staff
        `;
        const result = await client.query(query);

        const staff: Staff[] = result.rows.map(row => ({
            staff_id: row.staff_id,
            hotel_id: row.hotel_id,
            name: row.name,
            position: row.position,
            contact_info: row.contact_info,
        }));

        res.json(staff);
    } catch (err: any) {
        console.error('Staff fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        client.release();
    }
});

// Endpoint for bookings
app.get('/api/bookings', async (_req: Request, res: Response) => {
    const client: PoolClient = await getConnection();

    try {
        const query = `
            SELECT booking_id, guest_id, hotel_id, room_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights
            FROM Booking
        `;
        const result = await client.query(query);

        const bookings: Booking[] = result.rows.map(row => ({
            booking_id: row.booking_id,
            guest_id: row.guest_id,
            hotel_id: row.hotel_id,
            room_id: row.room_id,
            no_of_adults: row.no_of_adults,
            no_of_children: row.no_of_children,
            meal_plan: row.meal_plan,
            car_parking_space: row.car_parking_space,
            lead_time: row.lead_time,
            booking_status: row.booking_status,
            booking_date: row.booking_date,
            no_of_nights: row.no_of_nights,
        }));

        res.json(bookings);
    } catch (err: any) {
        console.error('Booking fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        client.release();
    }
});

// Endpoint to create a new reservation
app.post('/api/reservation', async (req: Request, res: Response): Promise<void> => {
    const client = await getConnection();
    try {
        const { no_of_adults, no_of_children, meal_plan, car_parking_space, booking_date, no_of_nights, room_type } = req.body;

        if (!no_of_adults || !meal_plan || !booking_date || !no_of_nights || !room_type) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const hotel_id = 1;
        const booking_status = "Not_Canceled";
        const lead_time = Math.floor((new Date(booking_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        const formattedBookingDate = new Date(booking_date).toISOString().split('T')[0];
        const bookingEndDate = new Date(new Date(booking_date).getTime() + no_of_nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Begin transaction
        await client.query('BEGIN');

        // Query to get available room_ids
        const availabilityQuery = `
            SELECT room_id 
            FROM Room 
            WHERE room_type = $1
            AND room_id NOT IN (
                SELECT room_id
                FROM Booking
                WHERE booking_status != 'Canceled'
                AND (
                    ($2::date BETWEEN booking_date AND booking_date + (no_of_nights - 1) * INTERVAL '1 day')
                    OR
                    ($3::date BETWEEN booking_date AND booking_date + (no_of_nights - 1) * INTERVAL '1 day')
                    OR
                    ($2::date <= booking_date AND $3::date >= booking_date)
                )
            )
        `;
        const availabilityResult = await client.query(availabilityQuery, [room_type, formattedBookingDate, bookingEndDate]);
        const availableRooms: number[] = availabilityResult.rows.map(row => row.room_id);

        if (availableRooms.length === 0) {
            await client.query('ROLLBACK');
            res.status(400).json({ error: 'No rooms available for the selected type and dates.' });
            return;
        }

        // Select a random room_id
        const room_id = availableRooms[Math.floor(Math.random() * availableRooms.length)];

        // Query to get available guest_ids
        const guestQuery = `
            SELECT guest_id 
            FROM Guest
            WHERE guest_id NOT IN (
                SELECT guest_id
                FROM Booking
                WHERE booking_status != 'Canceled'
                AND (
                    ($1::date BETWEEN booking_date AND booking_date + (no_of_nights - 1) * INTERVAL '1 day')
                    OR
                    ($2::date BETWEEN booking_date AND booking_date + (no_of_nights - 1) * INTERVAL '1 day')
                    OR
                    ($1::date <= booking_date AND $2::date >= booking_date)
                )
            )
        `;
        const guestResult = await client.query(guestQuery, [formattedBookingDate, bookingEndDate]);
        const availableGuests: number[] = guestResult.rows.map(row => row.guest_id);

        if (availableGuests.length === 0) {
            await client.query('ROLLBACK');
            res.status(400).json({ error: 'No guests available for the selected dates.' });
            return;
        }

        // Select a random guest_id
        const guest_id = availableGuests[Math.floor(Math.random() * availableGuests.length)];

        // Insert the booking record with the selected guest_id and room_id
        const insertQuery = `
            INSERT INTO Booking (hotel_id, room_id, guest_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::date, $11)
            RETURNING *
        `;
        const insertResult = await client.query(insertQuery, [
            hotel_id, room_id, guest_id, no_of_adults, no_of_children,
            meal_plan, car_parking_space, lead_time, booking_status,
            formattedBookingDate, no_of_nights
        ]);

        const newBooking = insertResult.rows[0];

        // Commit the transaction
        await client.query('COMMIT');

        res.json({ success: true, booking: newBooking });
    } catch (err) {
        console.error('Reservation creation error:', err);
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Reservation creation error' });
    } finally {
        client.release();
    }
});

// Endpoint to cancel a booking
app.put('/api/cancelBooking/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const client = await getConnection();
    try {
        const updateQuery = `
            UPDATE Booking
            SET booking_status = 'Canceled'
            WHERE booking_id = $1
        `;
        await client.query(updateQuery, [bookingId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Error cancelling booking' });
    } finally {
        client.release();
    }
});

// Endpoint to update meal plan
app.put('/api/updateMealPlan/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const { meal_plan } = req.body;

    const client = await getConnection();
    try {
        const updateQuery = `
            UPDATE Booking
            SET meal_plan = $1
            WHERE booking_id = $2
        `;
        await client.query(updateQuery, [meal_plan, bookingId]);
        res.json({ success: true, meal_plan });
    } catch (err) {
        console.error('Error updating meal plan:', err);
        res.status(500).json({ error: 'Error updating meal plan' });
    } finally {
        client.release();
    }
});

// Endpoint to update car parking space
app.put('/api/updateCarParkingSpace/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const { car_parking_space } = req.body;

    const client = await getConnection();
    try {
        const updateQuery = `
            UPDATE Booking
            SET car_parking_space = $1
            WHERE booking_id = $2
        `;
        await client.query(updateQuery, [car_parking_space, bookingId]);
        res.json({ success: true, car_parking_space });
    } catch (err) {
        console.error('Error updating car parking space:', err);
        res.status(500).json({ error: 'Error updating car parking space' });
    } finally {
        client.release();
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});