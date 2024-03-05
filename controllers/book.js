const Book = require("../models/Book");
const User = require("../models/User");
const mongoose = require('mongoose');

exports.getBook = async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if(!book) {
        return res.status(404).json({
            success: false,
            message: `No book with the id of ${req.params.id}`,
            data: null
        });
    }

    res.status(200).json({ success: true, data: book });
};

exports.getBooks = async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({ success: true, data: books });
};

exports.addBook = async (req, res, next) => {
    try {
        const { title, price, author, publisher, publishAt } = req.body;
    
        //Create book
        const book = await Book.create({
            title, price, author, publisher, publishAt
        });

        res.status(200).json({
            success: true,
            data: book
        });
    
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(err.stack);
      }
};

exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(404).json({
                success: false,
                message: `No book with the id of ${req.params.id}`
            });
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: book
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot update book'
        });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `No user with the id of ${req.params.id}`
            });
        }

        await Book.deleteOne({ _id: req.params.id });

        res.status(204).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot delete book'
        });
    }
}
