const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    sellerId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
})