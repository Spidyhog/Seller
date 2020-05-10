const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[{
        productId:{type:Schema.Types.ObjectId,required:true,ref:'product'},
        quantity:{type:Number,required:true}
    }],
    user:[{
        name:{type:String,required:true},
        userId:{type:Schema.Types.ObjectId,required:true,ref:'user'}
    }]
});
module.exports=mongoose.model('order',orderSchema);