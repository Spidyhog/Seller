const express = require('express');
const expressvalidator = require('express-validator');

const usersign = require('../controllers/user');
//const product = require('../controllers/product')
const { body } = require('express-validator/check');
const User = require('../models/user');
const Order = require('../models/order');

const userAuth = require('../middleware/userAuth');
const router = express.Router();


router.post('/signup', [
    expressvalidator.body('address').trim(),
    expressvalidator.body('email').trim().isEmail().withMessage('invalid Email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(UserDoc => {
                if (UserDoc) {
                    return Promise.reject('User already exists');
                }
            })
        }).normalizeEmail(),
    expressvalidator.body('phone').trim().isMobilePhone().withMessage('Invalid Phone number').custom((value, { req }) => {
        return User.findOne({ phone: value }).then(UserDoc => {
            if (UserDoc) {
                return Promise.reject('User already exists');
            }
        })
    }),
    expressvalidator.body('password').trim().isLength({ min: 5 }),
    expressvalidator.body('name').trim().isLength({ min: 3 }),
], usersign.postSignup);


router.post('/signin', [
    expressvalidator.body('email').trim().normalizeEmail(),
    expressvalidator.body('password').trim().isLength({ min: 5 })], usersign.signin);

router.get('/products',usersign.getProducts);

router.post('/postOrder',userAuth,usersign.postOrder);
    
module.exports = router;