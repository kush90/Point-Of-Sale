const Product = require('../models/product');
const Stock = require('../models/stock')
const mongoose = require('mongoose');
const { deleteImage } = require('../middleware/fileUpload');

const create = async (req, res) => {
    const { name, categoryId, description, price, qty, barCode } = req.body;
    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!categoryId) {
        emptyFields.push('categoryId')
    }
    if (!description) {
        emptyFields.push('description')
    }
    if (!price) {
        emptyFields.push('price')
    }
    if (!qty) {
        emptyFields.push('qty')
    }
    if (!barCode) {
        emptyFields.push('barCode')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    try {
        const imageInfo = await req.files.map((file) => {
            return {
                path: file.path,
                name: file.filename,
                type: file.mimetype
            }
        });
        const createdBy = req.user._id;
        const product = await Product.create({ name, categoryId, description, price, qty, barCode, createdBy, "available": qty, "images": imageInfo });
        const newProduct = await product.populate('categoryId');
        const stock = await Stock.create({productId:product.id,qty,times:1});
        if (!newProduct) {
            return res.status(404).json({ error: 'No such product' })
        }
        res.status(200).json({ data: newProduct, message: 'Product is successfully created.' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        let imageInfo = [];
        if (req.body?.images) {
            imageInfo = JSON.parse(req.body.images);
        }
        if (req.files.length > 0) {
            req.files.map((file) => {
                imageInfo.push({
                    path: file.path,
                    name: file.filename,
                    type: file.mimetype
                })
            });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such product' })
        }
        const existingDocument = await Product.findOne({ _id: id }).lean();
        console.log(existingDocument)
        let existingStock = await Stock.findOne({ productId: id }).lean();
       
        if (!existingDocument) {
            // Handle the case when the document is not found
            return res.status(404).json({ error: 'No such product' })
        }
        // check whether the qty is changed, if it is changed, update available value to qty value
        let available = existingDocument.available;
        if (existingDocument.qty !== +req.body.qty) {
            available = req.body.qty;
        }
        // if available become zero, so the price will be
        if(existingDocument.available === 0 && existingDocument.qty === 0) {
            // req.body.qty = 0;
            if(req.body.qty) {
                console.log(existingStock)
                existingStock.times += 1;
                existingStock.qty += +req.body.qty;
                await Stock.findOneAndUpdate({ productId: id }, existingStock);
            }
            

        }
        const product = await Product.findOneAndUpdate({ _id: id }, {
            ...req.body, "images": imageInfo, available
        }, { new: true }).populate('categoryId');
        res.status(200).json({ data: product, message: 'Product is successfully updated.' })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }

}

const getAll = async (req, res) => {
    try {
        let query = {};
        if (Object.keys(req.query).length !== 0) {

            // Check if req.query.name is present and not empty
            if (req.query.name) {
                query.name = { '$regex': req.query.name, '$options': 'ix' };
            }
            if (req.query.categoryId) {
                if (!mongoose.Types.ObjectId.isValid(req.query.categoryId)) {
                    return res.status(404).json({ error: 'No such category' })
                }
                query.categoryId = req.query.categoryId;
            }
        }
        const products = await Product.find(query).populate('categoryId').sort({ createdAt: -1 });
        res.status(200).json({ data: products })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const get = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such product' })
        }
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'No such product' })
        }
        res.status(200).json({ data: product })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such product' })
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'No such product' })
        }
        product.images.map((img) => {
            deleteImage(img.path) // delete images under upload folder as well
        });
        res.status(200).json({ message: "Product is successfully deleted" });

    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}
module.exports = { create, update, getAll, get, remove };