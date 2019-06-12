const mongoose = require('mongoose');
const Product = require('../db/Models/products')

exports.ADD_PRODUCTS = (req, res, next) => {
    console.log( req.file )
     const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         title: req.body.title,
         price: req.body.price,
         description: req.body.description,
         company: req.body.company,
         productImage: req.file.path
     })
     product.save()
     .then(product => {
         console.log('db product: ', product )
         res.status(201).json({ 
             success: true, 
             message: 'Product Created', 
             data: product,
            })
     })
     .catch(err => {
         res.status(500).json({ success: false, error: err })
     })
 }


exports.GET_ALL_PRODUCTS = (req, res, next) => {
    Product.find()
    .exec()
    .then(product => {
      if( product.length > 0 ) {
         return res.status(200).json({success: true, data: product})
      }
      res.status(402).json({alert: 'There is no product in db'})
    })
    .catch(err => {
        res.status(500).json({success: false, error: err })
    })
 }

 exports.GET_PRODUCT = (req, res, next) => {
    const id = req.params.productId
    Product.findById({ _id: id })
    .exec()
    .then(product => {

        if(!product) {
           return res.status(404).json({error: 'No Product exist for this Id'})
        }
            res.status(200).json({success: true, data: product})
    })
    .catch(err => {
        res.status(500).json({ success: false, error: err })
    })
}

exports.UPDATE_PRODUCT = (req, res, next) => {
    const id = req.params.productId
    Product.findByIdAndUpdate({_id: id}, { $set: {
        title: req.body.title,
        price: req.body.price,
        company: req.body.company,
        description: req.body.description
    } 
    })
    .exec()
    .then(product => {
        if( !product ) {
           return res.status(404).json({ error: 'Product not found for this Id '})
        } 
            res.status(200).json({ 
                success: true, 
                message: 'Product Updated', 
                data: {
                  Method: 'PATCH',
                  URL: `http://localhost:8000/products/${product._id}`,
                  product,
                  }
        })
    })
    .catch(err => {
        res.status(500).json({ success: false, error: err })
    })
}

exports.DELETE_PRODUCT = (req, res, next) => {
    const id = req.params.productId

    Product.findByIdAndRemove( {_id: id } )
    .exec()
    .then(product => {
        if(!product) {
           return res.status(404).json({ error: 'Product not found for this id '})
        } 
            res.status(200).json({ success: true, message: 'Product Deleted', data: product })
    })
    .catch(err => {
        res.status(500).json({ success: false, error: err })
    })
}