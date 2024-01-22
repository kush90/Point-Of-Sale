const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.login(name, password);
        const token = createToken(user._id);
        res.status(200).json({ token, "user": user.name, "type": user.type })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { name, password, type } = req.body;
    try {
        const user = await User.signup(name, password, type);
        const token = createToken(user._id);
        res.status(200).json({ token, "name": user.name, "type": user.type })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await User.forgotPassword(name, password);
        res.status(200).json({ message: result });
    }
    catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        let query = {};
        if (Object.keys(req.query).length !== 0) {

            // Check if req.query.search is present and not empty
            if (req.query.search) {
                query.name = { '$regex': req.query.search, '$options': 'i' };
            }
        }
        const users = await User.find(query).sort({ createdAt: -1 });
        res.status(200).json({ data: users })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const update = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    console.log(req.query)
    let message = 'User is successfully updated!';
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such user' })
        }
        if (req.query.action !== 'Update User') {
            if (!validator.isStrongPassword(req.body.password)) {
                throw Error('Password is not strong enough');
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            req.body.password = hash;
            message = "Password is successfully changed!"
        }
        const user = await User.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'No such user' })
        }

        res.status(200).json({ data: { "_id": user._id, "name": user.name, "type": user.type }, message  })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }

}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such user' })
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'No such user' })
        }
        res.status(200).json({ message: "User is successfully deleted" });
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

module.exports = { signupUser, loginUser, forgotPassword, getAll, update, remove }