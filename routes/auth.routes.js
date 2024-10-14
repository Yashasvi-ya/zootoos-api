const express = require('express');
const { signin, signup } = require('../controllers/auth.controllers');  // No need for '.js' extension in CommonJS

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
