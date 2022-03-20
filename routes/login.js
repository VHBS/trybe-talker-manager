const express = require('express');
const loginController = require('../controllers/loginController');
const loginVerification = require('../middlewares/loginVerification');

const router = express.Router();

router.post('/', loginVerification, loginController);

module.exports = router;