const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2'); // Ajouter MySQL

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'data'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Définir le dossier 'public' comme dossier statique
app.use(express.static(path.join(__dirname, 'public')));

// Routes pour différentes pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Accueil.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Contact.html'));
});

app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Réservation.html'));
});

app.get('/api/testreservations', (req, res) => {
  const query = 'SELECT * FROM booking'; // Remplacez par le nom de votre table
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur serveur');
      return;
    }
    res.json(results); // Envoyer les résultats en JSON
  });
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});


