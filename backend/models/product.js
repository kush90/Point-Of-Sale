const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Category"
    },
    price: {
        type: Number,
        required: true
    },
    barCode: {
        type:String,
        required:true
    },
    qty: {
        type:Number,
        required :true
    },
    images: [
        {
          type: Object
        },
      ],
},
    {
        timestamps: true
    }
);

module.exports =  mongoose.model('Product',productSchema)