const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../models/user');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    return res.status(200).send(users);
});

router.get('/me', auth, async (req, res) => { 
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.details[0].message);}
    
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(
        _.pick(req.body, ['_id', 'name', 'email', 'password'])
        // name: req.body.name,
        // email: req.body.email,
        // password: req.body.password
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    // to choose what we return as a response
    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email']));
    // return res.status(200).send({
    //     name: user.name,
    //     email: user.emal
    // });
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true });
    if (!user) return res.status(404).send("The given user id wasn't found");
    return res.status(200).send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("The given user id wasn't found");
    return res.status(200).send(user);
});

module.exports = router;

