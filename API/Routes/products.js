const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs')
const checkAuth = require('../middlewares/check-auth')
const ProductsController = require('../controllers/products')
const storage = multer.diskStorage({
    destination: (req, file, next) => {

        fs.exists("./uploads", function (exists) {

            if (exists) {

                next(null, "./uploads");

            } else {

                fs.mkdir("./uploads", function (err, folder) {
                    next(null, "./uploads");
                });

            }


        });
    },

    filename: (req, file, next) => {
        next(null, new Date().getTime() + file.originalname)
    }
})

const upload = multer({
    storage: storage
})

router.post('/', checkAuth, upload.single('productImage'), ProductsController.ADD_PRODUCTS)

//all products

router.get('/', ProductsController.GET_ALL_PRODUCTS)

//GET One Product
router.get('/:productId', ProductsController.GET_PRODUCT)


//UPDATE One Product
router.patch('/:productId', checkAuth, ProductsController.UPDATE_PRODUCT)

//DELETE Product

router.delete('/:productId', checkAuth, ProductsController.DELETE_PRODUCT)

module.exports = router