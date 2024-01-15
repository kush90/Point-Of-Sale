const Order = require('../models/order');
const Product = require('../models/product')
const mongoose = require('mongoose')

const create = async (req, res) => {
    const { totalAmount, products } = req.body;
    const prefix = "ORD0000";
    const totalOrders = await Order.countDocuments();
    let index = 1;
    let referenceNo = '';
    if (totalOrders == 0) {
        referenceNo = prefix + index;
    }
    else {
        const latestRecord = await Order.findOne({}, {}, { sort: { 'createdAt': -1 } }).lean();
        index += latestRecord.index;
        referenceNo = prefix + index;

    }
    let emptyFields = []

    if (!totalAmount) {
        emptyFields.push('totalAmount')
    }
    if (!products) {
        emptyFields.push('products')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill all fields', emptyFields })
    }

    try {
        const userId = req.user._id;

        const order = await Order.create({ referenceNo, index, totalAmount, products, "createdBy": userId });
        products.map(async (product) => {
            let latestRecord = await Product.findById(product.id);
            if (latestRecord) {
                latestRecord.available = Number(latestRecord.available - product.qty);
                latestRecord.save();
            }

        });
        res.status(200).json({ data: order, message: 'Order is successfully created.' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such order' })
        }

        const order = await Order.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }

        res.status(200).json({ data: order, message: 'Order is successfully updated.' })
    } catch (error) {
        res.status(400).json({ "error": error.message })
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
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.status(200).json({ data: orders })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const get = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such order' })
        }
        const order = await Order.findById(id).populate();
        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }
        res.status(200).json({ data: order })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such order' })
        }
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }
        res.status(200).json({ message: "Order is successfully deleted" });
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const chart = async (req, res) => {
    console.log(req.query)
    try {
        let query = {};
        if (Object.keys(req.query).length !== 0) {
            if (req.query.month) {
                let month = (+req.query.month  + 1); 
                query.$expr = {
                    $eq: [
                        { $month: '$createdAt' },
                        month
                    ]
                };
            }
        }
        else {
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
            const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59, 999);
            query = {
                createdAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        }

        const orders = await Order.find(query);
        res.status(200).json({ data: orders })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

module.exports = { create, update, getAll, get, remove, chart };