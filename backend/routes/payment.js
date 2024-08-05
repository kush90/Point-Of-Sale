const express = require('express');
const { create} = require('../controllers/payment');
const auth = require('../middleware/auth')

const payment = express.Router();
// payment.use(auth);
payment.post('/create-payment-intent',create);

module.exports = payment;