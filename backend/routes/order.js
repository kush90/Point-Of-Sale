const express = require('express');
const { create,update,getAll,get,remove,chart} = require('../controllers/order');
const auth = require('../middleware/auth')

const order = express.Router();
order.use(auth);
order.post('/create',create);
order.patch('/update/:id', update)
order.get('/getAll/',getAll);
order.get('/get/:id',get);
order.delete('/delete/:id',remove);
order.get('/chart',chart);

module.exports = order;