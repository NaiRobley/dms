'use strict';

const express = require('express');
const router = require('express-promise-router')();

const documentsController = require('../controllers/documentController');

// Middleware
const { validateParam, validateBody, schemas, verifyToken } = require('../helpers/routeHelpers');

router.route('/')
    .get(verifyToken(), documentsController.getDocuments)
    .post([verifyToken(), validateBody(schemas.documentSchema)], documentsController.createDocument);

router.route('/:documentID')
    .get([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
         documentsController.getDocument)
    .put([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
         documentsController.replaceDocument)
    .patch([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
            documentsController.updateDocument)
    .delete([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
            documentsController.deleteDocument);

module.exports = router;
