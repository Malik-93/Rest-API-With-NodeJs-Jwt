const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productShema = new Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    company: String,
    price: Number,
    productImage:{ data: Buffer, type: String ,required: true }
})

module.exports = mongoose.model('Product', productShema)