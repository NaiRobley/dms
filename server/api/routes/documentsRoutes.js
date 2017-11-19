'use strict';

const express = require('express'),
      router = require('express-promise-router')(),
      documentsController = require('../controllers/documentController'),
      // Middleware
      { validateParam, validateBody, schemas, verifyToken } = require('../helpers/routeHelpers');

router.route('/')
    .get(verifyToken(), documentsController.getDocuments)
    .post([verifyToken(), validateBody(schemas.documentSchema)], documentsController.createDocument);

router.route('/:documentID')
    .get([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
         documentsController.getDocument)
    .put([verifyToken(), validateParam(schemas.idSchema, 'documentID'), validateBody(schemas.documentSchema)],
         documentsController.replaceDocument)
    .patch([verifyToken(), validateParam(schemas.idSchema, 'documentID'), validateBody(schemas.documentSchemaOptional)],
            documentsController.updateDocument)
    .delete([verifyToken(), validateParam(schemas.idSchema, 'documentID')],
            documentsController.deleteDocument);

module.exports = router;
