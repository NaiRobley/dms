'use strict';

const Document = require('../models/documentModel');
const User = require('../models/userModel');
const { documentRoleCheck } = require('../helpers/routeHelpers');

module.exports = {
    // Get all documents
    getDocuments: async (req, res, next) => {
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 5;
        const documents = await Document.find({});
        documents.reduce((document) => documentRoleCheck(document, req.user));
        res.status(200).json(documents);
    },
    // Get a single document
    getDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const document = await Document.findById(documentID);
        res.status(200).json(document);
    },
    // Create a document
    createDocument: async (req, res, next) => {
        const newDocument = new Document(req.value.body);
        // Get user ID ( decoded from token)
        const owner = await User.findById(req.user.id);
        // Assign user as the owner of the document
        newDocument.owner = owner;
        // Save the document
        await newDocument.save();
        // Add document to user's documents
        owner.documents.push(newDocument);
        // Save the owner
        await owner.save();
        res.status(201).json(newDocument);
    },
    // Update a document (PATCH)
    updateDocument: async (req, res, next) => {
        // req.body can contain any number of fields
        const { documentID } = req.value.params;
        const newDocument = req.value.body;
        const result = await Document.findByIdAndUpdate(documentID, newDocument);
        res.status(200).json({success: true});        
    },
    // Replace a document (PUT)
    replaceDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const newDocument = req.value.body;
        const result = await Document.findByIdAndUpdate(documentID, newDocument);
        res.status(200).json({success: true});             
    },
    // Delete a document
    deleteDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const result = await Document.findByIdAndRemove(documentID);
        // remember to remove from a user's list
        res.status(200).json({success: true});
    },
    // Search for a document
    searchDocument: async (req, res, next) => {
        const query = req.query.q;
        const documents = Document.find({ title: query});
        res.status(200).json(documents);
    }
};
