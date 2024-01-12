const Product = require('../models/product');
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
        console.log(imageInfo)
        const createdBy = req.user._id;
        const product = await Product.create({ name, categoryId, description, price, qty, barCode, createdBy, "images": imageInfo });
        const newProduct = await product.populate('categoryId');
        console.log(newProduct)
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
        if (req.body?.images?.length > 0) {
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

        const product = await Product.findOneAndUpdate({ _id: id }, {
            ...req.body, "images": imageInfo
        }, { new: true }).populate('categoryId');

        if (!product) {
            return res.status(404).json({ error: 'No such product' })
        }

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