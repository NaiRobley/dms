'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai');
// chai.use(require('chai-http'));
const app = require('../server');
const should = chai.should();

const mongoose = require('mongoose');

const User = require('../api/models/userModel');
const Document = require('../api/models/documentModel');

describe('Tests for Documents Functionality', () => {
    // this.timeout(5000); // How long to wait for a resource
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        })
    });
    before(() => {
        // Create sample users
        // Create sample documents
    });
    after(() => {
        // Remove the users
        // Remove the documents
    });

    describe('Create a document with all the required attributes', () => {
        it('should successfully create a document', (done) => {
            const document = {}
            chai.request(app)
                .post('/api/documents')
                .send(document)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Document successfully created');
                    res.body.book.should.have.property('title');
                    res.body.book.should.have.property('content');
                    res.body.book.should.have.property('access');
                  done();
                });
        });
    });

    describe('Create a document with invalid attributes', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .post('/api/documents')
                .send(document)
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Create a document without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .post('/api/documents')
                .send(document)
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch all documents documents', () => {
        it('should return a list of documents', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch documents without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch all documents as an admin', () => {
        it('should return a list of all documents', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .send(document)
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch documents as a normal user', () => {
        it('should return a list of public documents and those owned by the user', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .send(document) 
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single public document', () => {
        it('should return a document object', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single private document as the owner', () => {
        it('should return a document object', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single private document not as the owner', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single admin document as an admin', () => {
        it('should return a document object', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single admin document as a normal user', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a single document without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Fetch a non-existing document', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .get('/api/documents')
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Update a document', () => {
        it('should successfully update a document', (done) => {
            const document = {}
            chai.request(app)
                .patch('/api/documents')
                .send(document) 
                .end((err, res) => {

                  done();
                });
        });
    });

    describe('Update a document without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .patch('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Update a document without ownership', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .patch('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Update a document with invalid attributes', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .patch('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Update a non-existing document document', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .patch('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Replace a document', () => {
        it('should return a success message', (done) => {
            const document = {}
            chai.request(app)
                .put('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Replace a document with invalid attributes', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .put('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Replace a non existing document', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .put('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Replace a document without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .put('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Replace a document without ownership', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .put('/api/documents')
                .send(document) 
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Delete a document', () => {
        it('should return a success message', (done) => {
            const document = {}
            chai.request(app)
                .delete('/api/documents')
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Delete a document without auth', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .delete('/api/documents')
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Delete a document without ownership', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .delete('/api/documents')
                .end((err, res) => {
                    
                  done();
                });
        });
    });

    describe('Delete a non-existent document', () => {
        it('should return an error message', (done) => {
            const document = {}
            chai.request(app)
                .delete('/api/documents')
                .end((err, res) => {
                    
                  done();
                });
        });
    });
});
