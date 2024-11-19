const express = require('express');
const path = require('path');
const app = express();

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

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
