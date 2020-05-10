const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "error",
            errors: errors.array()
        });
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    bcrypt
        .hash(password, 12)
        .then(hashedpw => {
            const user = new User({

                name: name,
                email: email,
                phone: phone,
                address: address,
                password: hashedpw
            });
            return user.save();
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User Created Succesfully',
                user: result
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
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Incorrect Email');
                error.statusCode = 401;
                throw error;
            }
            //console.log("Hello");
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Passsword');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, 'secret', { expiresIn: '48h' });
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getProducts = (req, res, next) => {
    var usersProjection = {
        sellerId: false,
        stock: false,
        updatedAt: false,
        __v: false
    };
    Product.find({}, usersProjection).then((products) => {
        res.send(products);
    });
}

exports.postOrder = (req, res, next) => {
    const product = JSON.parse(JSON.stringify(req.body.products));
    const products = product.map(i => {
        return { productId: i.productId, quantity: i.quantity }
    });
    //     for (var i=0; i<jsonObject['products'].length; i++){
    //         // here jsonObject['sync_contact_list'][i] is your current "bit"
    console.log(req.userId);
    //     }
    User.findById(req.userId).then((user) => {
        //console.log(user);
        name = user.name;
        const order = new Order({
            user: {
                name: name,
                userId: req.userId
            },
            products: products
        });
        order.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order Created Succesfully',
                user: result
            });
        })

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}