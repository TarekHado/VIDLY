const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Customer, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    return res.status(200).send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("The given customer id wasn't found"); 
    return res.status(200).send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    if (!customer) return res.status(404).send("The given customer id wasn't found");
    await customer.save();
    return res.status(200).send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });
    if (!customer) return res.status(404).send("The given customer id wasn't found");
    return res.status(200).send(customer);
});

router.delete('/:id', [admin, auth], async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send("The given customer id wasn't found");
    return res.status(200).send(customer);
});

module.exports = router;

