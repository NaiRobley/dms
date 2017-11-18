'use strict';
const jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      Joi = require('joi');

module.exports = {
    // Generate a token when logging in
    generateToken: (payload) => {
        var token = jwt.sign(payload, 'SuperSecretKey', {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    },
    // Verify a token on a request
    verifyToken: () => {
        return (req, res, next) => {
            if (!req.headers.token){
                res.status(400).json({ success: false, message: 'Please provide a token, or login to get one'});
            } else {
                const token = req.headers.token;
                jwt.verify(token, 'SuperSecretKey', (err, decoded) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        req.user = decoded;
                        next();
                    }
                });            
            }
        }
    },
    // Verify password during login or update
    confirmPassword: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    },
    // Role verification for documents when updating and deleting
    documentRoleCheck: (document, user) => {
       if (document.owner == user.id ) {
            return document;
       }      
    },
    // Check the role of documents while fetching
    documentAccessCheck: (document, user) => {
        if (document.access === 'admin' && document.owner == user.id ) {
             return document;
        }
        if (document.access === 'admin' && user.role === 'admin') {
             return document;
        }
        if (document.access === 'private' && document.owner == user.id) {
             return document;
        }
        if (document.access === 'public') {
             return document;
        }         
     },
    // Validation of the request parameters
    validateParam: (schema, name) => {
        return (req, res, next) => {
            const result = Joi.validate({ param: req['params'][name] }, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['params']){
                    req.value['params'] = {};
                }
                req.value['params'][name] = result.value.param;
                next();
            }
        }
    },
    // Validation of the request body
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }

                if (!req.value['body']){
                    req.value['body'] = {};
                }
                req.value['body'] = result.value;
                next()
            }
        }
    },
    // Schemas to be used for validation
    schemas: {
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
        }),
        // For POST and PUT requests validation
        userSchema: Joi.object().keys({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            bio: Joi.string(),
            role: Joi.string()
        }),
        // For PATCH requests validation
        userSchemaOptional: Joi.object().keys({
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            bio: Joi.string(),
            role: Joi.string()
        }),
        // For POST and PUT requests validation
        documentSchema: Joi.object().keys({
            title: Joi.string().required(),
            content: Joi.string().required(),
            access: Joi.string().required()
        }),
        // For PATCH requests validation
        documentSchemaOptional: Joi.object().keys({
            title: Joi.string(),
            content: Joi.string(),
            access: Joi.string()
        })        
    }
};
