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

describe('Tests for Search Functionality', () => {
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

    describe('GET /api/search/users/ - Search for users', () => {
        it('should return a list of users', (done) => {
            chai.request(app)
                .get('/api/search/users/?q=s')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.users.should.be.a('array');
                  done();
                });
        });
    });  

    describe('GET /api/search/users/ - Search for a user without query', () => {
        it('should return all users', (done) => {
            chai.request(app)
                .get('/api/search/users/?q=')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.users.should.be.a('array');                    
                    done();
                });
        });
    });   

    describe('GET /api/search/users/ - Failing search for a user', () => {
        it('should return an empty list', (done) => {
            chai.request(app)
                .get('/api/search/users/?q=z')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.users.should.be.a('array');
                    res.body.users.should.have.property('length').eql(0);                
                    done();
                });
        });
    });   

    describe('GET /api/search/users/ - Search for a user without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/search/users/?q=s')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();           
                });
        });
    });   

    describe('GET /api/search/documents/ - Search for a document', () => {
        it('should return a list of documents', (done) => {
            chai.request(app)
                .get('/api/search/documents/?q=s')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.results.should.be.a('array');
                  done();
                });
        });
    });  

    describe('GET /api/search/documents/ - Search for a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/search/documents/?q=z')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();   
                });
        });
    });  

    describe('GET /api/search/documents/ - Failing search for a document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/search/documents/?q=z')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.results.should.be.a('array');
                    res.body.results.should.have.property('length').eql(0);                
                    done();
                });
        });
    });
});
