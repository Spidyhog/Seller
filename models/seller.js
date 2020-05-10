const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    gstin:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    products:[
        {
            type:Schema.Types.ObjectId,
            ref:'product'
        }
    ]
},{timestamps:true});

module.exports=mongoose.model('seller',sellerSchema);