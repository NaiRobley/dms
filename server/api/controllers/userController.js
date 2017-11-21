'use strict';

const User = require('../models/userModel'),
      bcrypt = require('bcrypt'),
      { generateToken, encryptPassword, confirmPassword } = require('../helpers/routeHelpers');

module.exports = {
    // Log in a user
    login: async (req, res) => {
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
    logout: async (req, res) => {

    },
    // Find matching instances of user
    getUsers: async (req, res) => {
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 5;
        const users = await User.find({}, { password: 0 });
        res.status(200).json({success: true, users: users});
    },
    // Create a new user
    registerUser: async (req, res) => {
        const newUser = new User(req.value.body);
        const user = await newUser.save();
        res.status(201).json({success: true, message: 'User successfully registered', user: {username: user.username, email: user.email}});
    },
    // Find a single user by their userID
    findUser: async (req, res) => {
        const { userID } = req.value.params;
        const user = await User.findById(userID, { password: 0 });
        res.status(200).json(user);

    },
    // Update user attributes (PATCH)
    updateUser: async (req, res) => {
        // get user id from decoded token
        const userID = req.user.id;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userID, newUser);
        res.status(200).json({success: true, message: 'Update successful'});
    },
    // Replace user (PUT)
    replaceUser: async (req, res) => {
        // get user id from decoded token
        const userID = req.user.id;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userID, newUser);
        res.status(200).json({success: true, message: 'Update successful'});
    },
    // Delete a user
    deleteUser: async (req, res) => {
        // get user id from decoded token
        const userID = req.user.id;
        const result = await User.findByIdAndRemove(userID);
        res.status(204).json({success: true});
    },
    // Search for users
    searchUser: async (req, res) => {
        const query = new RegExp(req.query.q, 'i');
        var users = await User.find({ username: query }, { password: 0 });
        res.status(200).json({success: true, users: users});
    },
    // Get a user's documents
    userDocuments: async (req, res) => {
        const { userID } = req.value.params;
        const user = await User.findById(userID).populate('documents');
        res.status(200).json({ success: true, documents: user.documents });
    }
};
