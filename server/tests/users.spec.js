'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai');
chai.use(require('chai-http'));
const app = require('../server');
const should = chai.should();

const mongoose = require('mongoose');

const User = require('../api/models/userModel');
const Document = require('../api/models/documentModel');
const testData = require('./test_data');

let adminToken = '';

let normalUserToken = '';

let adminID = '';

let normalUserID = '';

describe('Tests for Users Functionality', () => {

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
                done();
            });          
    });
    after((done) => {
        // Remove the users
        User.remove({}, (err) => {
            done();
        });
    });
    after((done) => {
        // Remove the documents
        Document.remove({}, (err) =>{
            done();
        });
    });

    describe('POST /api/users - Create a user with all the required attributes', () => {
        it('should successfully create a new user with all the required attributes', (done) => {
            const sampleUser = {
                username: 'sampleUser',
                password: 'sampleUserPassword',
                email: 'sample@user.com',
                role: 'normal',
                bio: 'A sample normal user'
            };
            chai.request(app)
                .post('/api/users')
                .send(sampleUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully registered');
                    res.body.user.should.have.property('username');
                    res.body.user.should.have.property('email');
                  done();
                });
        });
    });

    describe('POST /api/users - Create a user without all the required attributes', () => {
        it('should return an  object with the message', (done) => {
            const user = {
                username: 'sampleUserB',
                password: 'sampleUserPassword'
            };
            chai.request(app)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.details.should.be.a('array');
                    res.body.details[0].should.have.property('message');
                  done();
                });
        });
    });

    describe('POST /api/users/login - Login as a registered user', () => {
        it('should return a success message and a token', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'sampleNormal', password: 'sampleNormalPassword'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('success').eql(true);
                    done();
            });   
        });
    });

    describe('POST /api/users/login - Log in as a non existent user', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'newuser', password: 'newpassword'})
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User not found');
                    res.body.should.have.property('success').eql(false);
                    done();
            });   
        });
    });

    describe('POST /api/users/login - Login with invalid/wrong credentials', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'sampleNormal', password: 'WrongPword'})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Wrong password');
                    res.body.should.have.property('success').eql(false);
                done();
            });   
        });
    });

    describe('PATCH /api/users/ Update a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .set('token', adminToken)
                .send({ username: 'sampleAdminNew',
                        email: 'sample@adminnew.com',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Update successful');
                    res.body.should.have.property('success').eql(true);      
                    done();              
                });
        });
    });

    describe('PATCH /api/users/ - Update a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .send({ username: 'sampleAdminNew',
                        email: 'sample@adminnew.com',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();              
                });
        });
    });

    describe('PUT /api/users/ - Replace a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .set('token', adminToken)
                .send({ username: 'sampleAdmin',
                        password: 'sampleAdminPassword',
                        email: 'sample@admin.com',
                        role: 'admin',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Update successful');
                    res.body.should.have.property('success').eql(true);      
                    done();              
                });
        });
    });

    describe('PUT /api/users - Replace a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .send({ username: 'sampleAdmin',
                        password: 'sampleAdminPassword',
                        email: 'sample@admin.com',
                        role: 'admin',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();              
                });
        });
    });

    describe('GET /api/users/:userID/documents/ - Get a user\'s documents', () => {
        it('should return a list of the user\'s documents', (done) => {
            chai.request(app)
                .get(`/api/users/${adminID}/documents`)
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.documents.should.be.a('array');
                    res.body.should.have.property('success').eql(true);      
                    done();   
                });
        });
    });

    describe('GET /api/users/:userID/documents/ - Get a user\'s documents without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get(`/api/users/${adminID}/documents`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();
            });
        });
    }); 

    describe('GET /api/users/ - Get all users', () => {
        it('should get a list of all users', (done) => {
            chai.request(app)
                .get('/api/users')
                .set('token', normalUserToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.users.should.be.a('array');
                    done();
                });
        });
    });

    describe('GET /api/users/ - Get all users without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();
                });
        });
    });

    describe('DELETE /api/users/ - Delete a user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .delete('/api/users/')
                .set('token', adminToken)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.should.be.a('object');
                    done();
                });
        });
    });

    describe('DELETE /api/users/ - Delete a user without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/users/')
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
