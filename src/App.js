import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    age: '',
    profession: '',
    email: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setErrorMessage('Erreur lors de la récupération des utilisateurs.');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingUserId) {
      axios
        .put(`http://localhost:5000/users/${editingUserId}`, newUser)
        .then((response) => {
          setSuccessMessage('Utilisateur modifié avec succès!');
          setNewUser({ nom: '', prenom: '', age: '', profession: '', email: '' });
          setEditingUserId(null);
          return axios.get('http://localhost:5000/users');
        })
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
          setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrorMessage('Erreur lors de la modification de l\'utilisateur.');
        });
    } else {
      axios
        .post('http://localhost:5000/users', newUser)
        .then((response) => {
          setSuccessMessage('Utilisateur ajouté avec succès!');
          setNewUser({ nom: '', prenom: '', age: '', profession: '', email: '' });
          return axios.get('http://localhost:5000/users');
        })
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
          setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrorMessage('Erreur lors de l\'ajout de l\'utilisateur.');
        });
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingUserId(user.id);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.error('Erreur lors de la suppression de l\'utilisateur.'));
  };

  return (
    <div className="container">
      <h1>Liste des Utilisateurs</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="loading-message">Chargement...</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={newUser.nom}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={newUser.prenom}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Âge"
          value={newUser.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={newUser.profession}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="button-add" disabled={loading}>
          <FontAwesomeIcon icon={faPlus} />
          {editingUserId ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.nom} {user.prenom} - {user.age} - {user.profession} - {user.email}
            <div>
              <button className="button-edit" onClick={() => handleEdit(user)}>
                <FontAwesomeIcon icon={faEdit} />
                Modifier
              </button>
              <button className="button-delete" onClick={() => handleDelete(user.id)}>
                <FontAwesomeIcon icon={faTrash} />
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
