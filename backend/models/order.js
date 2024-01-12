const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    referenceNo: {
        type: String,
        required: false
    },
    products: [{
        type: Object,
        required:true,
      }],
    totalAmount: {
        type: Number,
        required: true
    },
    index: {
        type:Number,
        required:true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema)