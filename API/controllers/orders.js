const mongoose = require("mongoose");
const Order = require('../db/Models/orders' );
const Product = require("../db/Models/products");

exports.CREATE_ORDER = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.GET_ALL_ORDERS = (req, res, next) => {
    Order.find()
      .select("product quantity _id")
      .populate("product", "name")
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };
  

exports.GET_ORDER = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.DELETE_ORDER = (req, res, next) => {
  Order.findByIdAndDelete({ _id: req.params.orderId })
    .exec()
    .then(result => {
      if( !result ) {
        res.status(404).json({message: 'Order not found'})
      }
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "DELETE",
          url: "http://localhost:3000/orders",
          body: { productId: result._id, quantity: result.quantity }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};