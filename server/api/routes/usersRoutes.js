'use strict';

const express = require('express');
const router = require('express-promise-router')();

const usersController = require('../controllers/userController');

// Middleware
const { validateParam, validateBody, schemas, verifyToken } = require('../helpers/routeHelpers');

router.route('/')
    .get(verifyToken(), usersController.getUsers)
    .post(validateBody(schemas.userSchema), usersController.registerUser);

router.route('/:userID')
    .get([verifyToken(), validateParam(schemas.idSchema, 'userID')],
         usersController.findUser)
    .put([verifyToken(), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema)],
         usersController.replaceUser)
    .patch([verifyToken(), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchemaOptional)],
           usersController.updateUser)
    .delete([verifyToken(), validateParam(schemas.idSchema, 'userID')],
            usersController.deleteUser);

router.route('/login')
    .post(usersController.login);

router.route('/logout')
    .post(verifyToken(), usersController.logout);

router.route('/:userID/documents')
    .get([verifyToken(), validateParam(schemas.idSchema, 'userID')],
         usersController.userDocuments);

// router.route('/search')
//     .get(verifyToken(), usersController.searchUser);

module.exports = router;
