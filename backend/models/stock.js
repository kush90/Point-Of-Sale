const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    qty: {
        type: Number,
        required: true,
    },
    times:{
        type:Number,
        required:true
    },
    sold: {
        type:Number,
        required:true,
        default:0
    }

},
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Stock', stockSchema)