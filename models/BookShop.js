const mongoose = require("mongoose");

const BookShopSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add a name"],
  },
  owner: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    require: [true, "Please add an owner's name"],
  },
  location: {
    type: String,
    require: [true, "Please add the shop location"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  books: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      amount: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoosse.model("BookShop", BookShopSchema);
