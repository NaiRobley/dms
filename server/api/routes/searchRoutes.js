'use strict';

const express = require('express'),
      router = require('express-promise-router')(),
      documentsController = require('../controllers/documentController'),
      userController = require('../controllers/userController'),
      // Middleware
      { verifyToken } = require('../helpers/routeHelpers');

router.route('/documents')
    .get(verifyToken(), documentsController.searchDocument);

router.route('/users')
    .get(verifyToken(), userController.searchUser);

module.exports = router;
