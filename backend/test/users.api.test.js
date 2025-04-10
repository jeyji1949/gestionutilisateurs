const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const db = require('../../db');

chai.use(chaiHttp);
const { expect } = chai;

describe('API Users', () => {
  before((done) => {
    db.run('DELETE FROM users', done);
  });

  let testUserId;

  it('POST /users - devrait créer un utilisateur', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({
        nom: 'Test',
        prenom: 'User',
        age: 30,
        profession: 'Developer',
        email: 'test@example.com'
      });
    
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id');
    testUserId = res.body.id;
  });

  it('GET /users/:id - devrait récupérer un utilisateur', async () => {
    const res = await chai.request(app)
      .get(`/users/${testUserId}`);
    
    expect(res).to.have.status(200);
    expect(res.body.nom).to.equal('Test');
  });

  it('PUT /users/:id - devrait mettre à jour un utilisateur', async () => {
    const res = await chai.request(app)
      .put(`/users/${testUserId}`)
      .send({
        nom: 'Updated',
        prenom: 'User',
        age: 31,
        profession: 'Senior Dev',
        email: 'updated@example.com'
      });
    
    expect(res).to.have.status(200);
    expect(res.body.nom).to.equal('Updated');
  });

  it('DELETE /users/:id - devrait supprimer un utilisateur', async () => {
    const res = await chai.request(app)
      .delete(`/users/${testUserId}`);
    
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Utilisateur supprimé.");
  });
});