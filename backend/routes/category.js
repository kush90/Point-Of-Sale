const express = require('express');
const { create,update,getAll,get,remove } = require('../controllers/category');
const auth = require('../middleware/auth')

const category = express.Router();
category.use(auth);
category.post('/create',create);
category.patch('/update/:id', update)
category.get('/getAll/',getAll);
category.get('/get/:id',get);
category.delete('/delete/:id',remove);
module.exports = category;