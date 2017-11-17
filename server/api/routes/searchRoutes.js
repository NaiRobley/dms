'use strict';

const express = require('express');
const router = require('express-promise-router')();

const documentsController = require('../controllers/documentController');
const userController = require('../controllers/userController');

router.route('/documents')
    .get(documentsController.searchDocument);

router.route('/users')
    .get(userController.searchUser);

module.exports = router;
