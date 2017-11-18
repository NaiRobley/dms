'use strict';

const express = require('express');
const router = require('express-promise-router')();

const documentsController = require('../controllers/documentController');
const userController = require('../controllers/userController');

// Middleware
const { verifyToken } = require('../helpers/routeHelpers');

router.route('/documents')
    .get(verifyToken(), documentsController.searchDocument);

router.route('/users')
    .get(verifyToken(), userController.searchUser);

module.exports = router;
