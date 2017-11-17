'use strict';

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken, encryptPassword, confirmPassword } = require('../helpers/routeHelpers');

module.exports = {
    // Log in a user
    login: async (req, res, next) => {
        await User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                res.status(400).json(err);
            } else {
                if (!user) {
                    res.status(404).json({ success: false, message: 'User not found'});
                } else if (user) {
                    const state = confirmPassword(req.body.password, user.password);
                    if (state != true) {
                        res.status(401).json({ success: false, message: 'Wrong password'});
                    } else {
                        const payload = {
                            id: user._id,
                            username: user.username,
                            role: user.role
                        };
                        const token = generateToken(payload);
                        res.status(200).json({ id: user._id, token: token, success: true });
                    }
                }
            }
        });
    },
    // Log out a user
    logout: async (req, res, next) => {

    },
    // Find matching instances of user
    getUsers: async (req, res, next) => {
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 5;
        const users = await User.find({});
        res.status(200).json({success: true, users: users});
    },
    // Create a new user
    // VALIDATED
    registerUser: async (req, res, next) => {
        const newUser = new User(req.value.body);
        const user = await newUser.save();
        res.status(201).json({success: true, message: 'User successfully registered', user: {username: user.username, email: user.email}});
    },
    // Find a single user by their userID
    // VALIDATED
    findUser: async (req, res, next) => {
        const { userID } = req.value.params;
        const user = await User.findById(userID);
        res.status(200).json(user);

    },
    // Update user attributes (PATCH)
    // VALIDATED
    updateUser: async (req, res, next) => {
        // get user id from decoded token
        const userID = req.user.id;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userID, newUser);
        res.status(200).json({success: true, message: 'Update successful'});
    },
    // Replace user (PUT)
    // VALIDATED
    replaceUser: async (req, res, next) => {
        // get user id from decoded token
        const userID = req.user.id;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userID, newUser);
        res.status(200).json({success: true, message: 'Update successful'});
    },
    // Delete a user
    // VALIDATED
    deleteUser: async (req, res, next) => {
        // get user id from decoded token
        const userID = req.user.id;
        const result = await User.findByIdAndRemove(userID);
        res.status(204).json({success: true});
    },
    // Search for users
    searchUser: async (req, res, next) => {
        const query = req.query.q;
        const users = await User.find({ username: query });
        res.status(200).json({success: true, users: users});
    },
    // Get a user's documents
    userDocuments: async (req, res, next) => {
        const { userID } = req.value.params;
        const user = await User.findById(userID).populate('documents');
        res.status(200).json({ success: true, documents: user.documents });
    }
};
