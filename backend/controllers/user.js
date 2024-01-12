const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.login(name, password);
        const token = createToken(user._id);
        res.status(200).json({ token,"user":user.name,"type":user.type })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { name, password,type } = req.body;
    try {
        const user =await  User.signup(name, password,type);
        const token = createToken(user._id);
        res.status(200).json({token, "name":user.name,"type":user.type })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { name, password } = req.body;
      try{
        const result = await User.forgotPassword(name,password);
        res.status(200).json({ message: result});
      }
      catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
      }
}

module.exports = {signupUser,loginUser,forgotPassword}