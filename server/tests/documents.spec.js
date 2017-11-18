'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai'),
      should = chai.should(),
      app = require('../server'),
      mongoose = require('mongoose'),
      User = require('../api/models/userModel'),
      Document = require('../api/models/documentModel'),
      testData = require('./test_data');

chai.use(require('chai-http'));

let adminToken = '',
    normalUserToken = '',
    adminID = '',
    normalUserID = '',
    publicDocument = {},
    privateDocument = {},
    adminDocument = {},
    adminDocumentB = {};


describe('Tests for Documents Functionality', () => {
    // Create a sample admin user
    before((done) => {
        chai.request(app)
            .post('/api/users/')
            .send(testData.sampleAdmin)
            .end((err, res) => {
                done();
            });
    });
    // Log in as a sample admin user
    before((done) => {
        chai.request(app)
        .post('/api/users/login/')
        .send(testData.sampleAdmin)
        .end((err, res) => {
            adminToken = res.body.token;
            adminID = res.body.id;
            done();
        });   
    });
    // Create a sample normal user
    before((done) => {
        chai.request(app)
            .post('/api/users/')
            .send(testData.sampleNormal)
            .end((err, res) => {
                done();
            });        
    });
    // Log in as a sample normal user
    before((done) => {
        chai.request(app)
            .post('/api/users/login/')
            .send(testData.sampleNormal)
            .end((err, res) => {
                normalUserToken = res.body.token;
                normalUserID = res.body.id;
            done();
        });   
    });    
    // Create admin documents
    before((done) => {
        chai.request(app)
            .post('/api/documents/')
            .set('token', adminToken)
            .send(testData.sampleAdminDocumentA)
            .end((err, res) => {
                done();
            });          
    });
    before((done) => {
        chai.request(app)
            .post('/api/documents/')
            .set('token', adminToken)
            .send(testData.sampleAdminDocumentB)
            .end((err, res) => {
                adminDocument = res.body.document;
                done();
            });          
    });
    before((done) => {
        chai.request(app)
            .post('/api/documents/')
            .set('token', adminToken)
            .send(testData.sampleAdminDocumentB)
            .end((err, res) => {
                adminDocumentB = res.body.document;
                done();
            });          
    });    
    after((done) => {
        // Remove the users
        User.remove({}, (err) => {
            done();
        })
        // Remove the documents
    });
    after((done) => {
        // Remove the documents
        Document.remove({}, (err) =>{
            done();
        });
    });    

    describe('POST /api/documents - Create a document with all the required attributes', () => {
        it('should successfully create a document', (done) => {
            chai.request(app)
                .post('/api/documents')
                .set('token', adminToken)
                .send(testData.sampleAdminDocument)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document successfully created');
                    res.body.document.should.have.property('title');
                    res.body.document.should.have.property('content');
                    res.body.document.should.have.property('access');
                  done();
                });
        });
    });

    describe('POST /api/documents - Create a document with invalid attributes', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .post('/api/documents')
                .set('token', adminToken)
                .send({ title: 'Sample Admin Document A',
                        content: 'The content for sample admin document a'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('details');
                    res.body.should.have.property('name').eql('ValidationError');
                    res.body.details[0].should.have.property('message');
                  done();
                });
        });
    });

    describe('POST /api/documents - Create a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .post('/api/documents')
                .send({ title: 'Sample Admin Document A',
                        content: 'The content for sample admin document a'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);   
              done();
            });
        });
    });

    describe('GET /api/documents - Fetch all documents documents', () => {
        it('should return a list of documents', (done) => {
            chai.request(app)
                .get('/api/documents')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('documents');
                  done();
                });
        });
    });

    describe('GET /api/documents - Fetch documents without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false); 
                  done();
                });
        });
    });

    describe('GET /api/documents/:documentID - Fetch a single document', () => {
        it('should return a document object', (done) => {
            chai.request(app)
                .get(`/api/documents/${adminDocument._id}`)
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('document');                    
                  done();
                });
        });
    });

    describe('GET /api/documents/:documentID - Fetch a single document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
            .get(`/api/documents/${adminDocument._id}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                res.body.should.have.property('success').eql(false); 
              done();
            });
        });
    });

    describe('GET /api/documents/:documentID - Fetch a non-existing document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/documents/5a0e9bdf66d0b332d5cd9e30')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you do not have access to it');
                    res.body.should.have.property('success').eql(false); 
                  done();
                });
        });
    });

    describe('PATCH /api/documents/:documentID - Update a document', () => {
        it('should successfully update a document', (done) => {
            chai.request(app)
                .patch(`/api/documents/${adminDocument._id}`)
                .set('token', adminToken)
                .send({ title: 'New Title' }) 
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document updated successfully');
                    res.body.should.have.property('success').eql(true); 
                  done();
                });
        });
    });

    describe('PATCH /api/documents/:documentID - Update a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch(`/api/documents/${adminDocument._id}`)
                .send({ title: 'New Title' }) 
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false); 
                  done();
                });
        });
    });

    describe('PATCH /api/documents/:documentID - Update a document without ownership', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch(`/api/documents/${adminDocument._id}`)
                .set('token', normalUserToken)
                .send({ title: 'New Title' }) 
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you are not allowed to modify it');
                    res.body.should.have.property('success').eql(false);                     
                  done();
                });
        });
    });

    describe('PATCH /api/documents/:documentID - Update a non-existing document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/documents/5a0e9bdf66d0b332d5cd9e30')
                .set('token', adminToken)
                .send({ title: 'New Title'})
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you do not have access to it');
                    res.body.should.have.property('success').eql(false); 
                done();
                });
        });
    });

    describe('PUT /api/documents/:documentID - Replace a document', () => {
        it('should successfully replace a document', (done) => {
            chai.request(app)
                .put(`/api/documents/${adminDocument._id}`)
                .set('token', adminToken)
                .send({ title: 'New Title', content: 'New Content', access: 'public' }) 
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document updated successfully');
                    res.body.should.have.property('success').eql(true); 
                done();
                });
        });
    });

    describe('PUT /api/documents/:documentID - Replace a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put(`/api/documents/${adminDocument._id}`)
                .send({ title: 'New Title' }) 
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false); 
                done();
                });
        });
    });

    describe('PUT /api/documents/:documentID - Replace a document without ownership', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put(`/api/documents/${adminDocument._id}`)
                .set('token', normalUserToken)
                .send({ title: 'New Title', content: 'New Content', access: 'public' })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you are not allowed to modify it');
                    res.body.should.have.property('success').eql(false);                     
                done();
                });
        });
    });

    describe('PUT /api/documents/:documentID - Replace a non-existing document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put('/api/documents/5a0e9bdf66d0b332d5cd9e30')
                .set('token', adminToken)
                .send({ title: 'New Title', content: 'New Content', access: 'public' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you do not have access to it');
                    res.body.should.have.property('success').eql(false); 
                done();
                });
        });
    });

    describe('PUT /api/documents/:documentID - Replace a document without all fields', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put(`/api/documents/${adminDocument._id}`)
                .set('token', adminToken)
                .send({ title: 'New Title' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('ValidationError');
                done();
                });
        });
    });

    
    describe('DELETE /api/documents/:documentID - Delete a document without ownership', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .delete(`/api/documents/${adminDocument._id}`)
                .set('token', normalUserToken)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you are not allowed to modify it');
                    res.body.should.have.property('success').eql(false);                       
                  done();
                });
        });
    });

    describe('DELETE /api/documents/:documentID - Delete a document', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .delete(`/api/documents/${adminDocumentB._id}`)
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document deleted successfully');
                    res.body.should.have.property('success').eql(true);                   
                  done();
                });
        });
    });

    describe('DELETE /api/documents/:documentID - Delete a non-existent document', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .delete('/api/documents/5a0e9bdf66d0b332d5cd9e31')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document does not exist or you do not have access to it');
                    res.body.should.have.property('success').eql(false);                     
                  done();
                });
        });
    });    

    describe('DELETE /api/documents/:documentID - Delete a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete(`/api/documents/${adminDocument._id}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);                     
                  done();
                });
        });
    });

});
