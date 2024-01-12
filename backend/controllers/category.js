const Category = require('../models/category');
const mongoose = require('mongoose')

const create = async (req, res) => {
    const { name } = req.body;
    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill the category name', emptyFields })
    }

    try {
        const userId = req.user._id;
        const category = await Category.create({ name, "createdBy": userId });
        if (!category) {
            return res.status(404).json({ error: 'No such category' })
        }
        res.status(200).json({ data: category, message: 'Category is successfully created.' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
const update = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such category' })
        }

        const category = await Category.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true });

        if (!category) {
            return res.status(404).json({ error: 'No such category' })
        }

        res.status(200).json({ data: category, message: 'Category is successfully updated.' })
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
        const categories = await Category.find(query).sort({ createdAt: -1 });
        res.status(200).json({ data: categories })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const get = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such category' })
        }
        const category = await Category.findById(id).populate();
        if (!category) {
            return res.status(404).json({ error: 'No such category' })
        }
        res.status(200).json({ data: category })
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such category' })
        }
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: 'No such category' })
        }
        res.status(200).json({ message: "Category is successfully deleted" });
    } catch (error) {
        res.status(400).json({ "error": error.message })
    }
}

module.exports = { create, update, getAll, get, remove };