const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().required().min(5),
        phone: Joi.string().required().min(5),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;