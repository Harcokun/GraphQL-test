const mongoose = require('mongoose');

const Book = mongoose.Schema({
    title: {
        type: String,
        require: [true, "Please add a name"],
    },
    price: {
        type: Number,
        require: [true, "Please add book price in Baht"],
    },
    author: {
        type: String,
        require: [true, "Please add an owner's name"],
    },
    publisher: {
        type: String,
        require: [true, "Please add a book publisher"],
    },
    publishAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model("Book", Book);