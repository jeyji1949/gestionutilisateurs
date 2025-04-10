const assert = require('assert');
const http = require('http');
const app = require('../server.js');

// Helper function to make HTTP requests
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    // Start server on random port
    const server = app.listen(0, () => {
      const port = server.address().port;
      
      // Prepare request options
      const options = {
        hostname: 'localhost',
        port: port,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          server.close();
          
          if (body) {
            try {
              body = JSON.parse(body);
            } catch (e) {
              // If not JSON, keep as string
            }
          }
          
          resolve({
            status: res.statusCode,
            body: body
          });
        });
      });
      
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  });
}

describe('API Users', function() {
  this.timeout(5000);
  let testUserId;
  
  it('should create a user', async () => {
    const userData = {
      nom: 'Test',
      prenom: 'User',
      age: 30,
      profession: 'Developer',
      email: 'test@example.com'
    };
    
    const res = await request('POST', '/users', userData);
    
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.id);
    testUserId = res.body.id;
  });
  
  it('should retrieve a user', async () => {
    const res = await request('GET', `/users/${testUserId}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nom, 'Test');
  });
  
  it('should update a user', async () => {
    const updatedUserData = {
      nom: 'Updated',
      prenom: 'User',
      age: 31,
      profession: 'Senior Dev',
      email: 'updated@example.com'
    };
    
    const res = await request('PUT', `/users/${testUserId}`, updatedUserData);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nom, 'Updated');
  });
  
  it('should delete a user', async () => {
    const res = await request('DELETE', `/users/${testUserId}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'Utilisateur supprimé.');
  });
});