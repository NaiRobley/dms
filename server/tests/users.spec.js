'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai');
// chai.use(require('chai-http'));
const app = require('../server');
const should = chai.should();

const mongoose = require('mongoose');

const User = require('../api/models/userModel');
const Document = require('../api/models/documentModel');

describe('Tests for Users Functionality', () => {
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

    describe('Create a user with all the required attributes', () => {
        it('should successfully create a new user with all the required attributes', (done) => {
            const user = {}
            chai.request(app)
                .post('/api/users')
                .send(user) // User object
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully registered');
                    res.body.book.should.have.property('username');
                    res.body.book.should.have.property('email');
                  done();
                });
        });
    });

    describe('Create a user without all the required attributes', () => {
        it('should return an error', (done) => {
            const user = {}
            chai.request(app)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('missing_parameter');
                    res.body.errors.pages.should.have.property('message').eql('required');
                  done();
                });
        });
    });

    describe('Create a user with invalid attributes', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users', {})
                .end((err, res) => {

                });
        });
    });

    describe('Login as a registered user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .post('/api/users/login', {})
                .end((err, res) => {

                });
        });
    });

    describe('Log in as a non existent user', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login', {})
                .end((err, res) => {

                });
        });
    });

    describe('Login with invalid/wrong credentials', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login', {})
                .end((err, res) => {

                });
        });
    });

    describe('Update a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .send()
                .end((err, res) => {

                });
        });
    });

    describe('Update a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Update a non-existent user\'s detail', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Replace a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .put('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Replace a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Replace a non-existent user\'s', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Delete a user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .delete('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Delete a user without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Delete a non-existent user', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/users/', {})
                .end((err, res) => {

                });
        });
    });

    describe('Get a user\'s documents', () => {
        it('should return a list of documents', (done) => {
            chai.request(app)
                .delete(`/api/users/${userID}/documents`, {})
                .end((err, res) => {

                });
        });
    });

    describe('Get a user\'s documents without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete(`/api/users/${userID}/documents`, {})
                .end((err, res) => {

                });
        });
    }); 

    describe('Get all users', () => {
        it('should get a list of all users', (done) => {
            chai.request(app)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('array');
                    res.body.length.should.be.eql(0);
                });
        });
    });

    describe('Get all users without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('array');
                    res.body.length.should.be.eql(0);
                });
        });
    });
});
