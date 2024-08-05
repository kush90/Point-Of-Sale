const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },

},
    {
        timestamps: true
    }
);
module.exports =  mongoose.model('Product',productSchema)