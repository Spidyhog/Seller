var mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Product = require('../models/product');
exports.getProducts = (req, res, next) => {
    Product.find({}).then(function (products) {
        res.send(products);
        });
    }

exports.addProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "error",
            errors: errors.array()
        });
    }
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const stock = req.body.stock;
    const sellerId ='';

    const product = new Product({
        name: name,
        price: price,
        description: description,
        stock: stock,
        sellerId: req.sellerId
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product Added Succesfully',
                product: result
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.editProduct = (req, res, next) => {
    console.log((req.params.productId));
    productId=req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "error",
            errors: errors.array()
        });
    }
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const stock = req.body.stock;
    Product.findById(productId).then(product => {
        if (!product) {
            const error = new Error('Could not find product');
            error.statusCode = 404;
            throw error;
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.stock = stock;
        return product.save();
    }).then(result => {
        res.status(200).json({ message: 'Product Updated', product: result });
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.delProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product');
                error.statusCode = 404;
                throw error;
            }
            return Product.findByIdAndDelete(productId);
        }).then(result => {
            res.status(200).json({ message: 'Product Deleted', product: result });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}