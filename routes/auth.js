const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const jws = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    
    const token = user.generateAuthToken();
    return res.send(token);

});

// router.put('/logout', auth, async (req, res) => {
//     const user = await User.findById(req.user._id);
//     req.user.decoded = '';
// });

function validate(req) {
    const schema = {
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255)
    };
    return Joi.validate(req, schema);
}

module.exports = router;

