const express = require('express');
const expressvalidator = require('express-validator');

const sellersign = require('../controllers/seller');
const product = require('../controllers/product')
const { body } = require('express-validator/check');
const Seller = require('../models/seller');

const sellerAuth = require('../middleware/sellerAuth');
const router = express.Router();


router.post('/signup', [
    expressvalidator.body('gstin').trim().custom((value, { req }) => {
        return Seller.findOne({ email: value }).then(SellerDoc => {
            if (SellerDoc) {
                return Promise.reject('Seller already exists');
            }
        })
    }),
    expressvalidator.body('email').trim().isEmail().withMessage('invalid Email')
        .custom((value, { req }) => {
            return Seller.findOne({ email: value }).then(SellerDoc => {
                if (SellerDoc) {
                    return Promise.reject('Seller already exists');
                }
            })
        }).normalizeEmail(),
    expressvalidator.body('phone').trim().isMobilePhone().withMessage('Invalid Phone number').custom((value, { req }) => {
        return Seller.findOne({ phone: value }).then(SellerDoc => {
            if (SellerDoc) {
                return Promise.reject('Seller already exists');
            }
        })
    }),
    expressvalidator.body('password').trim().isLength({ min: 5 }),
    expressvalidator.body('name').trim().isLength({ min: 3 }),
], sellersign.postSignup);


router.post('/signin', [
    expressvalidator.body('email').trim().normalizeEmail(),
    expressvalidator.body('password').trim().isLength({ min: 5 })], sellersign.signin);

router.get('/products',sellerAuth,product.getProducts);

router.post('/product', sellerAuth, [
    expressvalidator.body('name').trim().isLength({ min: 2 }).withMessage('Invalid Name'),
    expressvalidator.body('price').trim(),
    expressvalidator.body('description').trim()
], product.addProduct);

router.put('/product/:productId', sellerAuth, [
    expressvalidator.body('name').trim().isLength({ min: 2 }),
    expressvalidator.body('price').trim(),
    expressvalidator.body('description').trim()
], product.editProduct);

router.delete('/product/:productId', sellerAuth, product.delProduct);

module.exports = router;