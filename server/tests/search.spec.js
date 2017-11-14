'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai');
// chai.use(require('chai-http'));
const app = require('../server');
const should = chai.should();

const mongoose = require('mongoose');

const User = require('../api/models/userModel');
const Document = require('../api/models/documentModel');

describe('Tests for Search Functionality', () => {
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

    describe('Search for a user', () => {
        it('should return a list of users', (done) => {
            chai.request(app)
                .delete('/api/search/users/', {})
                .end((err, res) => {

                });
        });
    });  

    describe('Search for a user without query', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/users/', {})
                .end((err, res) => {

                });
        });
    });   

    describe('Failing search for a user', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/users/', {})
                .end((err, res) => {

                });
        });
    });   

    describe('Search for a user without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/users/', {})
                .end((err, res) => {

                });
        });
    });   

    describe('Search for a document', () => {
        it('should return a list of documents', (done) => {
            chai.request(app)
                .delete('/api/search/documents/', {})
                .end((err, res) => {

                });
        });
    });  

    describe('Search for a document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/documents/', {})
                .end((err, res) => {

                });
        });
    });  

    describe('Failing search for a document', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/documents/', {})
                .end((err, res) => {

                });
        });
    });  

    describe('Search for a document without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/search/documents/', {})
                .end((err, res) => {

                });
        });
    });  

});



