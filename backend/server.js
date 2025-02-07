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
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Création de la table utilisateurs
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

// Routes API
app.get('/', (req, res) => res.send('API Running'));
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/users', (req, res) => {
    const { nom, prenom, age, profession, email } = req.body;
    db.run(`
        INSERT INTO users (nom, prenom, age, profession, email)
        VALUES (?, ?, ?, ?, ?)
    `, [nom, prenom, age, profession, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});
app.delete('/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});
app.put('/users/:id', (req, res) => {
    const { nom, prenom, age, profession, email } = req.body;
    const sql = `UPDATE users SET nom = ?, prenom = ?, age = ?, profession = ?, email = ? WHERE id = ?`;
    db.run(sql, [nom, prenom, age, profession, email, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Utilisateur mis à jour" });
    });
});


// Démarrer le serveur
app.listen(port, () => console.log(`Server running on port ${port}`));
