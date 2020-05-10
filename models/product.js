const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prodSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock:{
        type: String,
        required: true
    },
    sellerId:{
        type: Schema.Types.ObjectId,
        ref:'seller',
        required: true
    }
},{timestamps:true});
module.exports=mongoose.model('product',prodSchema);