const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connexion à SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) return console.error(err.message);
  console.log('📦 Connected to SQLite database.');
});

// Création de la table si elle n'existe pas
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INTEGER CHECK(age > 0),
    profession TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK(email LIKE '%@%')
  )
`);

// Middleware de validation utilisateur
function validateUser(req, res, next) {
  const { nom, prenom, age, profession, email } = req.body;

  if (!nom || !prenom || !profession || !email || !age) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "L'âge doit être un nombre positif." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "L'email est invalide." });
  }

  next();
}

// Routes API
app.get('/', (req, res) => res.send('🚀 API Running'));

// Obtenir tous les utilisateurs
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtenir un utilisateur par ID
app.get('/users/:id', (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.json(row);
  });
});

// Ajouter un utilisateur
app.post('/users', validateUser, (req, res) => {
  const { nom, prenom, age, profession, email } = req.body;
  console.log('📩 Données reçues :', req.body);

  db.run(`
    INSERT INTO users (nom, prenom, age, profession, email)
    VALUES (?, ?, ?, ?, ?)
  `, [nom, prenom, age, profession, email], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Cet email existe déjà." });
      }
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Utilisateur ajouté avec succès. ID : ${this.lastID}`);
    res.json({ id: this.lastID, nom, prenom, age, profession, email });
  });
});

// Modifier un utilisateur
app.put('/users/:id', validateUser, (req, res) => {
  const { nom, prenom, age, profession, email } = req.body;
  const sql = `UPDATE users SET nom = ?, prenom = ?, age = ?, profession = ?, email = ? WHERE id = ?`;

  db.run(sql, [nom, prenom, age, profession, email, req.params.id], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Cet email existe déjà." });
      }
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json({ id: req.params.id, nom, prenom, age, profession, email });
  });
});

// Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json({ message: "Utilisateur supprimé." });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
});
module.exports = app; // Exporter l'application pour les tests
// Fermer la connexion à la base de données à l'arrêt du serveur