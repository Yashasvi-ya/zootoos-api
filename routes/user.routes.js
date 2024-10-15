const express = require('express')
const { getUser, signout } = require('../controllers/user.controller.js')

const router  = express.Router()

router.get('/:userId', getUser)
router.post('/signout', signout)

module.exports = router;