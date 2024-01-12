const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type:String,
        required:true
    }
},
    {
        timestamps: true
    }
);

userSchema.statics.signup = async function (name, password, type) {

    if (!password || !name || !type) {
        throw Error('All fields must be filled')
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    const user = await this.findOne({ name });
    if (user) {
        throw Error('Name is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await this.create({ name, password: hash,type });
    return newUser;

}

userSchema.statics.login = async function (name, password) {
    if (!name || !password) {
        throw Error('All fields must be filled')
    }


    const matchUser = await this.findOne({ name });
    if (!matchUser) {
        throw Error('Incorrect name')
    }

    const matchPassword = await bcrypt.compare(password, matchUser.password);
    if (!matchPassword) {
        throw Error('Incorrect password')
    }
    return matchUser;
}
userSchema.statics.forgotPassword = async function (name, password) {
    try {
        if (!name || !password) {
            throw Error('All fields must be filled')
        }
    
        if (!validator.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
    
        const user = await this.findOne({ name });
        if (!user) {
            throw Error('Email is not found !');
        }
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.password = hash;
        user.save();
        return "Password is changed successfully.Please try to login with new one";
    } catch (error) {
        throw Error(error.message);
    }
}
module.exports = mongoose.model('User', userSchema)