const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser'); // Ajout du middleware pour traiter les données POST
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/reservation', (req, res) => {
  const {
      name,
      email,
      checkin,
      checkout,
      no_of_adults,
      no_of_children,
      room_id,
      parking
  } = req.body;

  // Calculs nécessaires
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const today = new Date();
  const lead_time = Math.floor((checkinDate - today) / (1000 * 60 * 60 * 24));
  const no_of_weekend_nights = [0, 6].includes(checkinDate.getDay()) || [0, 6].includes(checkoutDate.getDay()) ? 2 : 0;
  const no_of_week_nights = Math.floor((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)) - no_of_weekend_nights;

  // Récupérer le dernier booking_id
  const queryLastBookingId = `SELECT booking_id FROM booking ORDER BY booking_id DESC LIMIT 1`;

  db.query(queryLastBookingId, (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération du dernier booking_id :', err);
          res.status(500).send('Erreur serveur');
          return;
      }

      // Générer un nouvel ID (exemple : incrémenter le dernier ID)
      let lastBookingId = results.length > 0 ? parseInt(results[0].booking_id.replace('INN', '')) : 0;
      const newBookingId = `INN${lastBookingId + 1}`; // Format : INN001, INN002, ...

      // Insérer les données dans la base
      const insertQuery = `
          INSERT INTO booking (
              booking_id, guest_id, hotel_id, room_id, no_of_adults, no_of_children,
              no_of_weekend_nights, no_of_week_nights, meal_plan, car_parking_space,
              lead_time, arrival_full_date, booking_status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const newGuestId = Math.floor(Math.random() * 1000) + 1; // Exemple : Générer un ID client aléatoire
      db.query(insertQuery, [
          newBookingId,       // Nouveau booking_id généré
          2,         // guest id par defaut A CHANGER PAR LA SUITE( il faut a chaque fois générer un nouveau id en créant un nouveau client)
          1,                  // hotel_id par défaut
          room_id,            // ID de la chambre
          no_of_adults,
          no_of_children,
          no_of_weekend_nights,
          no_of_week_nights,
          'Meal Plan 1',      // Plan repas par défaut
          parking === 'Oui' ? 1 : 0,
          lead_time,
          checkin,
          'Not_Canceled'      // Statut par défaut
      ], (insertErr) => {
          if (insertErr) {
              console.error('Erreur lors de l\'ajout de la réservation :', insertErr);
              res.status(500).send('Erreur serveur');
              return;
          }

          res.status(200).send('Réservation ajoutée avec succès');
      });
      
  });
});



app.get('/api/testreservations', (req, res) => {
  const query = 'SELECT * FROM Booking where guest_id=2 AND no_of_adults=6';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur serveur');
      return;
    }
    res.json(results); // Envoyer les résultats en JSON
  });
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


// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});


