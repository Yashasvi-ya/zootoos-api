const express = require('express')
const { getUser, signout, addToCart, removeFromCart, getCart } = require('../controllers/user.controller.js')

const router  = express.Router()

router.get('/:userId', getUser)
router.post('/signout', signout)
router.post('/addtocart', addToCart)
router.post('/removefromcart', removeFromCart)
router.post('/getcart', getCart)

module.exports = router;