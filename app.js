const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MLAB_USER, MLAB_PW } = require('./API/config/configs')
const productRoutes = require('./API/Routes/products')
const orderRoutes = require('./API/Routes/orders')
const userRoutes = require('./API/Routes/users')

//Database config
mongoose.connect('mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PW + '@ds033133.mlab.com:33133/ranksol-jwt-rest-api', { useNewUrlParser: true })
mongoose.connection.once('open', () => {
    console.log('Successfully connected with database')
})

//Middlewares
// app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, PUT');
        return res.status(200).json({})
    }
    next()
})

//Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes)


module.exports = app