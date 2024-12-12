const express = require('express');
const path = require('path');
const { initialize } = require('./db'); // Importer la fonction de connexion à la base de données
const cors = require('cors');  // Import the CORS package
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());  // This will allow all origins to access your API

app.use(express.json());  // Middleware pour traiter les requêtes JSON

// Endpoint pour récupérer tous les hôtels
app.get('/api/hotels', async (req, res) => {
    const connection = await initialize();
    try {
        const query = `
            SELECT h.hotel_id, h.nameH, h.location, 
                   h.total_bookings
            FROM Hotel h
        `;
        const result = await connection.execute(query);

        // Map over the rows and return them as objects
        const hotels = result.rows.map(row => ({
            hotel_id: row[0],  // Assuming the first column is hotel_id
            nameH: row[1],     // Assuming the second column is nameH
            location: row[2],  // Assuming the third column is location
            total_bookings: row[3]  // Assuming the fourth column is total_bookings
        }));

        // Return the mapped data as JSON
        res.json(hotels);
    } catch (err) {
        console.error('Erreur lors de la récupération des hôtels:', err);
        res.status(500).send('Erreur interne');
    } finally {
        await connection.close();
    }
});

// Endpoint pour récupérer tous les réservations
app.get('/api/bookings', async (req, res) => {
    const connection = await initialize();
    try {
        const result = await connection.execute('SELECT * FROM Booking');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des réservations:', err);
        res.status(500).send('Erreur interne');
    } finally {
        await connection.close();
    }
});

// Endpoint pour récupérer tous les réservations
app.get('/api/staff', async (req, res) => {
    const connection = await initialize();
    try {
        const result = await connection.execute('SELECT * FROM Staff');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des employés:', err);
        res.status(500).send('Erreur interne');
    } finally {
        await connection.close();
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
