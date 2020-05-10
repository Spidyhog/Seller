const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const sellerRoutes = require('./routes/seller');
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acess-Control-Allow-Methods', '*');
    res.setHeader('Aceess-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});
app.use('/seller', sellerRoutes);
app.use('/user', userRoutes);
mongoose.connect(
    'mongodb+srv://admin:fbfuKOUSXQOLiIqF@cluster0-voers.gcp.mongodb.net/zhiffy?retryWrites=true&w=majority'
)
    .then(result => {
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => console.log(err));