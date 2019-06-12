const express = require('express');
const router = express.Router();
const OrderControllers = require('../controllers/orders');
const checkAuth = require('../middlewares/check-auth')

router.post('/', checkAuth, OrderControllers.CREATE_ORDER)


router.get('/', checkAuth, OrderControllers.GET_ALL_ORDERS)

router.get('/:orderId', checkAuth, OrderControllers.GET_ORDER)

router.delete('/:orderId', checkAuth, OrderControllers.DELETE_ORDER)

module.exports = router