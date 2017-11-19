'use strict';

const Document = require('../models/documentModel'),
      User = require('../models/userModel'),
      { documentAccessCheck, documentRoleCheck } = require('../helpers/routeHelpers');

module.exports = {
    // Get all documents
    getDocuments: async (req, res, next) => {
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 5;
        const allDocuments = await Document.find({});
        let documents = await allDocuments.filter((document, user) => documentAccessCheck(document, req.user));
        res.status(200).json({ success: true, documents: documents });
    },
    // Get a single document
    getDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const document = await Document.findById(documentID);
        if (document){
            const doc = await documentAccessCheck(document, req.user);
            if (doc) {
                res.status(200).json({ success: true, document: doc });
            } else {
                res.status(401).json({ success: false, message: "Document does not exist or you are not allowed to access it" });
            }
        } else {
            res.status(404).json({ success: false, message: 'Document does not exist or you do not have access to it' });
        }
        
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
        await owner.documents.push(newDocument);
        // Save the owner
        await owner.save();
        res.status(201).json({ success: true, document: newDocument, message: 'Document successfully created'});
    },
    // Update a document (PATCH)
    updateDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const newDocument = req.value.body;
        // Find the document and check access
        const document = await Document.findById(documentID);
        if (document){
            const doc = await documentRoleCheck(document, req.user);
            if (doc) {
                const result = await Document.findByIdAndUpdate(documentID, newDocument, {new: true});
                res.status(200).json({success: true, message: 'Document updated successfully'}); 
            } else {
                res.status(403).json({success: false, message: "Document does not exist or you are not allowed to modify it"});
            }
        } else {
            res.status(404).json({ success: false, message: 'Document does not exist or you do not have access to it' });
        }
    },
    // Replace a document (PUT)
    replaceDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        const newDocument = req.value.body;
        // Find the document and check access
        const document = await Document.findById(documentID);
        if (document){
            const doc = await documentRoleCheck(document, req.user);
            if (!doc) {
                res.status(403).json({success: false, message: "Document does not exist or you are not allowed to modify it"});
            } else if (doc) {
                const result = await Document.findByIdAndUpdate(documentID, newDocument, {new: true});
                res.status(200).json({success: true, message: 'Document updated successfully'}); 
            }
        } else {
            res.status(404).json({ success: false, message: 'Document does not exist or you do not have access to it' });
        }         
    },
    // Delete a document
    deleteDocument: async (req, res, next) => {
        const { documentID } = req.value.params;
        // Find the document and check access
        const document = await Document.findById(documentID);
        if (document){
            const doc = await documentRoleCheck(document, req.user);
            if (!doc) {
                res.status(403).json({success: false, message: "Document does not exist or you are not allowed to modify it"});
            }        
            const result = await Document.findByIdAndRemove(documentID);
            // Remove from owner's list of documents
            const owner = await User.findById(req.user.id);
            // owner.documents.pull(document)
            owner.documents = await owner.documents.filter((document) => { 
                return document != documentID;
            });
            await owner.save()
            // remember to remove from a user's list
            res.status(200).json({ success: true, message: 'Document deleted successfully'});
        } else {
            res.status(404).json({ success: false, message: 'Document does not exist or you do not have access to it' });
        }
    },
    // Search for a document
    searchDocument: async (req, res, next) => {
        const query = new RegExp(req.query.q, 'i');
        const allDocuments = await Document.find({ title: query });
        let documents = await allDocuments.filter((document, user) => documentAccessCheck(document, req.user));
        res.status(200).json({success: true, results: documents});
    }
};
