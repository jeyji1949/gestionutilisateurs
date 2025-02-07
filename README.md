# Gestion des utilisateurs - Projet client-serveur

Ce projet est une application client-serveur pour la gestion des utilisateurs. Il comprend :
- Un backend en **Express.js** avec une base de données **SQLite**.
- Un frontend en **React.js**.
- Des tests d'API avec **Postman**.
![Capture d'écran 2025-02-07 175646](https://github.com/user-attachments/assets/6215dee8-d79c-490d-a9df-70e1cdbc3b5d)

## Fonctionnalités
- **CRUD** (Create, Read, Update, Delete) pour les utilisateurs.
- Interface utilisateur simple pour afficher et ajouter des utilisateurs.

## Étapes de création

### 1. Backend (Express.js)
- Initialisation du projet avec `npm init`.
- Installation des dépendances : `express`, `sqlite3`, `cors`, `body-parser`.
- Création de la base de données SQLite (`database.db`) et de la table `users`.
- Implémentation des routes CRUD (`GET`, `POST`, `PUT`, `DELETE`).

### 2. Frontend (React.js)
- Création de l'application React avec `npx create-react-app frontend`.
- Installation d'Axios pour les requêtes HTTP.
- Création des composants `UserList` et `UserForm`.
- Connexion au backend pour afficher et ajouter des utilisateurs.

### 3. Base de données (SQLite)
![Capture d'écran 2025-02-07 170305](https://github.com/user-attachments/assets/af12abb2-61c3-4dc2-aeb8-a7ab8d566f3d)

- Utilisation du module `sqlite3` pour interagir avec la base de données.
- Création automatique du fichier `database.db` lors du premier lancement.
  
### 4. Tests avec Postman
- Tests des endpoints avec Postman :
  - `GET [/api/users](http://localhost:5000/users)` : Récupérer tous les utilisateurs.
    ![Capture d'écran 2025-02-07 164953](https://github.com/user-attachments/assets/f46b8307-5d26-4396-8b8a-ea08e65a9a0d)

  - `POST [/api/users](http://localhost:5000/users)` : Ajouter un nouvel utilisateur.
    {
  "nom": "safia",
  "prenom": "safia",
  "age": 22,
  "profession": "testeur",
  "email": "saf@example.com"
}
![Capture d'écran 2025-02-07 164908](https://github.com/user-attachments/assets/1e893717-3324-4c4b-9439-dd1b3dda2d01)

  - `PUT [/api/users/:id](http://localhost:5000/users/1)` : Mettre à jour un utilisateur.
        {
  "nom": "safia",
  "prenom": "safia",
  "age": 20,
  "profession": "testeur",
  "email": "saf@example.com"
}
![Capture d'écran 2025-02-07 165109](https://github.com/user-attachments/assets/5729bfc0-9103-4716-93c5-eb88f3ebe64d)

   - `DELETE [/api/users/:id](http://localhost:5000/users/1)` : Supprimer un utilisateur.
  ![Capture d'écran 2025-02-07 165313](https://github.com/user-attachments/assets/50bd12a1-652c-4737-bfba-70ae2eff7d4d)


## Installation et exécution

### Backend
1. Accédez au dossier `backend` :
 cd backend

2.installez les dépendances :.
npm install

3.Démarrez le serveur 
node server.js.

### frontend
npx create-react-app 
npm install axios react-router-dom

###Cloner ce projet depuis GitHub
Pour cloner ce projet sur votre machine, suivez les étapes suivantes :

Ouvrez un terminal.
Clonez le projet avec la commande suivante :
bash
Copier
Modifier
git clone https://github.com/username/gestion-utilisateurs.git
Suivez les instructions d'installation ci-dessus pour configurer et démarrer le projet.


# Initialiser le dépôt Git
git init

# Ajouter tous les fichiers au suivi de version
git add .

# Effectuer un commit initial
git commit -m "Premier commit: ajout des fichiers du projet"

# Lier ton dépôt local à GitHub
git remote add origin https://github.com/username/gestion-utilisateurs.git

# Pousser les fichiers vers GitHub
git push -u origin main

# Ajouter et committer des modifications futures
git add .
git commit -m "Description des modifications"

# Pousser les modifications vers GitHub
git push origin main

###font
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
