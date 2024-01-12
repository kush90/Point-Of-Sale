const express = require('express');
const {upload} = require('../middleware/fileUpload');
const { create,update,getAll,get,remove} = require('../controllers/product');
const auth = require('../middleware/auth')

const product = express.Router();
product.use(auth);
product.post('/create',upload.array('files'),create);
product.patch('/update/:id', upload.array('files'), update)
product.get('/getAll/',getAll);
product.get('/get/:id',get);
product.delete('/delete/:id',remove);
module.exports = product;