const express = require('express')
const { addProduct, getProducts } = require('../controllers/product.controller.js')

const router = express.Router()

router.post('/addproduct', addProduct)
router.get('/getproducts', getProducts)

module.exports = router