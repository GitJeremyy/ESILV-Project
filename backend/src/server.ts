import express, { Request, Response } from 'express';
import oracledb, {Connection} from 'oracledb';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { initialize } from './db';

// Configuration
const SECRET_KEY = 'secret';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

interface User {
    USER_ID:number;
    username: string;
    USER_PASSWORD: string;
}

interface Hotel {
    hotel_id: number;
    nameH: string;
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
    const { username, password }: { username: string; password: string } = req.body;

    if (!username || !password) {
        res.status(400).send({ message: 'Username and password are required.' });
        return;
    }

    const connection = await initialize();

    try {
        console.log('Executing query with username:', username);

        const query = `
      SELECT u.user_id, u.user_password
      FROM Users u
      WHERE u.username = :username
    `;
        const result = await connection.execute<User>(query, [username], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (!result.rows || result.rows.length === 0) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }

        const user = result.rows[0];
        if (!user.USER_PASSWORD) {
            res.status(500).send({ message: 'Password not found for the user.' });
            return;
        }

        if (password.trim() === user.USER_PASSWORD.trim()) {
            const token = jwt.sign({ userId: user.USER_ID, username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).send({ message: 'Invalid username or password.' });
        }
    } catch (err: any) {
        console.error('Login error:', err);
        res.status(500).send({ message: 'Internal error', error: err.message || err });
    } finally {
        await connection.close();
    }
});


// Endpoint pour les hôtels
app.get('/api/hotels', async (req: Request, res: Response) => {
    const connection = await initialize();

    try {
        const query = `
      SELECT h.hotel_id, h.nameH, h.location, h.total_bookings
      FROM Hotel h
    `;
        const result = await connection.execute(query);

        const hotels: Hotel[] = result.rows?.map((row: any) => ({
            hotel_id: row.HOTEL_ID,
            nameH: row.NAMEH,
            location: row.LOCATION,
            total_bookings: row.TOTAL_BOOKINGS,
        })) || [];

        res.json(hotels);
    } catch (err: any) {
        console.error('Hotel fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});


// Endpoint pour les invités
app.get('/api/guests', async (req: Request, res: Response) => {
    const connection = await initialize();

    try {
        const query = `
      SELECT g.guest_id, g.g_name, g.g_email, g.g_phone, 
             g.repeated_guest, g.previous_cancellations, 
             g.previous_bookings_not_canceled
      FROM Guest g
    `;
        const result = await connection.execute(query);


        const guests: Guest[] = result.rows?.map((row:any) => ({
            guest_id: row.GUEST_ID,
            g_name: row.G_NAME,
            g_email: row.G_EMAIL,
            g_phone: row.G_PHONE,
            repeated_guest: row.REPEATED_GUEST,
            previous_cancellations: row.PREVIOUS_CANCELLATIONS,
            previous_bookings_not_canceled: row.PREVIOUS_BOOKINGS_NOT_CANCELED,
        })) || [];

        res.json(guests);
    } catch (err: any) {
        console.error('Guest fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for rooms
app.get('/api/rooms', async (_req: Request, res: Response) => {
    const connection: Connection = await initialize();
    try {
        const query = `
            SELECT r.room_id, r.hotel_id, r.room_type, r.price
            FROM Room r
        `;
        const result = await connection.execute(query);

        const rooms: Room[] = result.rows?.map((row: any) => ({
            room_id: row.ROOM_ID,
            hotel_id: row.HOTEL_ID,
            room_type: row.ROOM_TYPE,
            price: parseFloat(row.PRICE)
        })) || [];

        res.json(rooms);
    } catch (err) {
        console.error('Room fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for staff
app.get('/api/staff', async (_req: Request, res: Response) => {
    const connection: Connection = await initialize();
    try {
        const query = `
            SELECT s.staff_id, s.hotel_id, s.name, s.position, 
                   s.contact_info
            FROM Staff s
        `;
        const result = await connection.execute(query);

        const staff: Staff[] = result.rows?.map((row: any) => ({
            staff_id: row.STAFF_ID,
            hotel_id: row.HOTEL_ID,
            name: row.NAME,
            position: row.POSITION,
            contact_info: row.CONTACT_INFO
        })) || [];

        res.json(staff);
    } catch (err) {
        console.error('Staff fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint for bookings
app.get('/api/bookings', async (_req: Request, res: Response) => {
    const connection: Connection = await initialize();
    try {
        const query = `
            SELECT b.booking_id, b.guest_id, b.hotel_id, b.room_id, 
                   b.no_of_adults, b.no_of_children, b.meal_plan, 
                   b.car_parking_space, b.lead_time, b.booking_status, 
                   b.booking_date, b.no_of_nights
            FROM Booking b
        `;
        const result = await connection.execute(query);

        const bookings: Booking[] = result.rows?.map((row: any) => ({
            booking_id: row.BOOKING_ID,
            guest_id: row.GUEST_ID,
            hotel_id: row.HOTEL_ID,
            room_id: row.ROOM_ID,
            no_of_adults: row.NO_OF_ADULTS,
            no_of_children: row.NO_OF_CHILDREN,
            meal_plan: row.MEAL_PLAN,
            car_parking_space: row.CAR_PARKING_SPACE,
            lead_time: row.LEAD_TIME,
            booking_status: row.BOOKING_STATUS,
            booking_date: row.BOOKING_DATE,
            no_of_nights: row.NO_OF_NIGHTS
        })) || [];

        res.json(bookings);
    } catch (err) {
        console.error('Booking fetching error:', err);
        res.status(500).send('Internal error');
    } finally {
        await connection.close();
    }
});

// Endpoint to create a new reservation
app.post('/api/reservation', async (req: Request, res: Response): Promise<void> => {
    const connection: Connection = await initialize();
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

        // Query to get available room_ids
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
        const availableRooms: number[] = availabilityResult.rows?.map((row: any) => row.ROOM_ID) || [];

        if (availableRooms.length === 0) {
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
                    (TO_DATE(:booking_date, 'YYYY-MM-DD') BETWEEN booking_date AND booking_date + no_of_nights - 1)
                    OR
                    (TO_DATE(:booking_end_date, 'YYYY-MM-DD') BETWEEN booking_date AND booking_date + no_of_nights - 1)
                    OR
                    (TO_DATE(:booking_date, 'YYYY-MM-DD') <= booking_date AND TO_DATE(:booking_end_date, 'YYYY-MM-DD') >= booking_date)
                )
            )
        `;
        const guestResult = await connection.execute(guestQuery, { booking_date: formattedBookingDate, booking_end_date: bookingEndDate });
        const availableGuests: number[] = guestResult.rows?.map((row: any) => row.GUEST_ID) || [];

        if (availableGuests.length === 0) {
            res.status(400).json({ error: 'No guests available for the selected dates.' });
            return;
        }

        // Select a random guest_id
        const guest_id = availableGuests[Math.floor(Math.random() * availableGuests.length)];

        // Insert the booking record with the selected guest_id and room_id
        const insertQuery = `
            INSERT INTO Booking (hotel_id, room_id, guest_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights)
            VALUES (:hotel_id, :room_id, :guest_id, :no_of_adults, :no_of_children, :meal_plan, :car_parking_space, :lead_time, :booking_status, TO_DATE(:booking_date, 'YYYY-MM-DD'), :no_of_nights)
        `;
        await connection.execute(insertQuery, { hotel_id, room_id, guest_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date: formattedBookingDate, no_of_nights });

        await connection.commit();

        // Select the newly created booking
        const selectQuery = `
            SELECT booking_id, hotel_id, room_id, guest_id, no_of_adults, no_of_children, meal_plan, car_parking_space, lead_time, booking_status, booking_date, no_of_nights
            FROM Booking
            WHERE booking_id = (SELECT MAX(booking_id) FROM Booking)
        `;
        const result = await connection.execute(selectQuery);
        const newBooking = result.rows?.map((row: any) => ({
            booking_id: row.BOOKING_ID,
            hotel_id: row.HOTEL_ID,
            room_id: row.ROOM_ID,
            guest_id: row.GUEST_ID,
            no_of_adults: row.NO_OF_ADULTS,
            no_of_children: row.NO_OF_CHILDREN,
            meal_plan: row.MEAL_PLAN,
            car_parking_space: row.CAR_PARKING_SPACE,
            lead_time: row.LEAD_TIME,
            booking_status: row.BOOKING_STATUS,
            booking_date: row.BOOKING_DATE,
            no_of_nights: row.NO_OF_NIGHTS
        }))[0];

        res.json({ success: true, booking: newBooking });
    } catch (err) {
        console.error('Reservation creation error:', err);
        await connection.rollback();
        res.status(500).json({ error: 'Reservation creation error' });
    } finally {
        await connection.close();
    }
});



// Endpoint to cancel a booking
app.put('/api/cancelBooking/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const connection: Connection = await initialize();
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

// Endpoint to update meal plan
app.put('/api/updateMealPlan/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const { meal_plan } = req.body;

    const connection: Connection = await initialize();
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

// Endpoint to update car parking space
app.put('/api/updateCarParkingSpace/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const { car_parking_space } = req.body;

    const connection: Connection = await initialize();
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});