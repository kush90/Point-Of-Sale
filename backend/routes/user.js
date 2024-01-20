const express = require('express');
const { loginUser, signupUser,forgotPassword,getAll, update,remove } = require('../controllers/user');
const user = express.Router();
user.post('/login',loginUser);
user.post('/signup',signupUser);
user.post('/forgot',forgotPassword);
user.get('/getAll',getAll);
user.patch('/update/:id',update);
user.delete('/delete/:id',remove);



module.exports = user;