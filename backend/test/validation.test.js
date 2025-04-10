const { expect } = require('chai');
const { validateUser } = require('../../middleware/validation'); // À adapter

describe('Middleware de validation', () => {
  const mockRequest = (body) => ({ body });
  const mockResponse = () => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.body = data;
      return res;
    };
    return res;
  };
  const next = () => {};

  it('devrait accepter un utilisateur valide', () => {
    const req = mockRequest({
      nom: 'Test',
      prenom: 'User',
      age: 30,
      profession: 'Dev',
      email: 'test@example.com'
    });
    const res = mockResponse();
    
    validateUser(req, res, next);
    expect(res.statusCode).to.be.undefined; // next() appelé
  });

  it('devrait rejeter un email invalide', () => {
    const req = mockRequest({
      nom: 'Test',
      prenom: 'User',
      age: 30,
      profession: 'Dev',
      email: 'invalid-email'
    });
    const res = mockResponse();
    
    validateUser(req, res, next);
    expect(res.statusCode).to.equal(400);
    expect(res.body.error).to.equal("L'email est invalide.");
  });
});