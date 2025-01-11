const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    dateOfSale: { type: Date, required: true },
    sold: { type: Boolean, required: true },
    category: { type: String },
});

module.exports = mongoose.model('Transaction', transactionSchema);