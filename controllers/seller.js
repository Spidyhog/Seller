const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const Seller = require('../models/seller');
const Order = require('../models/order');
const Product = require('../models/product');

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "error",
            errors: errors.array()
        });
    }
    const gstin = req.body.gstin;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    bcrypt
        .hash(password, 12)
        .then(hashedpw => {
            const seller = new Seller({
                gstin: gstin,
                name: name,
                email: email,
                phone: phone,
                password: hashedpw
            });
            return seller.save();
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Seller Created Succesfully',
                seller: result
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Seller.findOne({ email: email })
        .then(seller => {
            if (!seller) {
                const error = new Error('Incorrect Email');
                error.statusCode = 401;
                throw error;
            }
            //console.log("Hello");
            loadedSeller = seller;
            return bcrypt.compare(password, seller.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Passsword');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({ email: loadedSeller.email, userId: loadedSeller._id.toString() }, 'secret', { expiresIn: '48h' });
            res.status(200).json({
                token: token,
                sellerId: loadedSeller._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.viewOrders= (req, res, next) => {
    //const sellerId = req.sellerId;
    Seller.findById(req.sellerId).then(seller=>{
    console.log(seller.products.length);
    for(var i=0; i<seller.products.length; i++){
        Order.find({'products.productId':seller.products[i]}).lean()
        .then(order =>{
            order=JSON.stringify(order);
            console.log(order);
            console.log(order.products.productId);
            const orders = order.forEach(products => {
                return { productId: products.productId, quantity: products.quantity }
            });
            //console.log(orders);
        })
    }
})
.catch(err => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
})
}
