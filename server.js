const express = require('express');
const path = require('path');
const { initialize } = require('./db'); // Importer la fonction de connexion à la base de données
const app = express();
const port = 3000;

app.use(express.json());  // Middleware pour traiter les requêtes JSON

// Endpoint pour récupérer tous les hôtels
app.get('/api/hotels', async (req, res) => {
    const connection = await initialize();
    try {
        const result = await connection.execute('SELECT * FROM Hotel');
        res.json(result.rows);
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
        console.error('Erreur lors de la récupération des hôtels:', err);
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
        console.error('Erreur lors de la récupération des hôtels:', err);
        res.status(500).send('Erreur interne');
    } finally {
        await connection.close();
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
